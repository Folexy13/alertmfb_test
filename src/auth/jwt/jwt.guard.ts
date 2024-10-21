import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';// Adjust the import path as necessary
import { SKIP_AUTH_KEY } from '../../common/decorators/skip.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }
    canActivate(context: ExecutionContext) {
        const skipAuth = this.reflector.get<boolean>(SKIP_AUTH_KEY, context.getHandler());
        if (skipAuth) {
            return true; // Allow access if the route is marked to skip auth
        }
        return super.canActivate(context); // Proceed with default behavior
    }
}
