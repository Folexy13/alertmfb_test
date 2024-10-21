import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../database/prisma.services';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt/jwtStrategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  controllers: [AuthController,],

  providers: [AuthService, PrismaService, JwtStrategy]
})
export class AuthModule { }

