import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../common/decorators/roles.decorator';
import { UserService } from '../../user/user.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private userService: UserService) { }

    // Define the allowed HTTP methods for each role
    private rolePermissions = {
        ADMIN: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Admin has all permissions
        MODERATOR: ['GET', 'POST', 'PUT'], // Moderator can read and write
        USER: ['GET'], // User can only read
    };

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;  // No roles required, allow access
        }

        const request = context.switchToHttp().getRequest();
        const authorizationHeader = request.headers['authorization'];

        if (!authorizationHeader) {
            throw new UnauthorizedException('Missing authorization header');
        }
        const token = authorizationHeader.split(' ')[1];  // Extract the token from 'Bearer <token>'
        if (!token) {
            throw new UnauthorizedException('Invalid token format');
        }

        try {
            // Decode the token to get the user info (e.g., user ID from sub)
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;  // Decode token using your JWT secret
            const userId = decoded.sub;  // Extract user ID from the 'sub' field in the token

            const userEntity = await this.userService.getUserByIdOrEmail(userId);  // Fetch the user by their ID
            delete userEntity.passwordHash;  // Remove sensitive info
            const requestMethod = request.method;

            // Check if the user has the required roles and valid permissions for the action
            const hasRole = userEntity.roles.some((role) => {
                const roleKey = role.name.toUpperCase(); // Ensure role name matches the keys in rolePermissions

                if (requiredRoles.includes(roleKey)) {
                    const allowedMethods = this.rolePermissions[roleKey];  // Get allowed methods for the role

                    return allowedMethods?.includes(requestMethod);  // Check if the method is allowed for this role
                }
                return false;
            });

            if (!hasRole) {
                throw new ForbiddenException(`Action not allowed: Insufficient permissions for ${requestMethod}`);
            }

            return true;

        } catch (err) {
            throw err;
        }
    }
}
