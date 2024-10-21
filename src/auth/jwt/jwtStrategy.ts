import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../database/prisma.services';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';  // For handling specific JWT errors

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                include: { roles: true },
            });
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            return user;  // Attach the user object to the request

        } catch (error) {
            // Handle specific JWT errors
            if (error instanceof TokenExpiredError) {
                throw new UnauthorizedException('Token expired');
            } else if (error instanceof JsonWebTokenError) {
                throw new UnauthorizedException('Invalid token');
            }

            throw new UnauthorizedException('Authentication error');
        }
    }
}
