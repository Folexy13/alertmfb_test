import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/create.dto';
import { PrismaService } from '../database/prisma.services';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (user && (await bcrypt.compare(password, user.passwordHash))) {
        return user;
      }
      return null;
    } catch (error) {
      throw new InternalServerErrorException('Error validating user credentials');
    }
  }

  async login(loginDto: LoginDto): Promise<any> {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.passwordHash);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { email: user.email, sub: user.id, roles: user.roles }; // Include user roles in the token

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: '3h',
        secret: process.env.JWT_SECRET,
      });

      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET,
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(`An error Occured - ${error.message}`,);
    }
  }

  async register(data: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(data.passwordHash, 10); // Hash the password

      const user = await this.prisma.user.create({
        data: {
          ...data,
          passwordHash: hashedPassword, // Store the hashed password
        },
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002') { // Prisma error code for unique constraint violation
        throw new BadRequestException('Email already in use');
      }
      console.log(error)
      throw new InternalServerErrorException(`An error Occured - ${error.message}`,);
    }
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const { email } = data;
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new NotFoundException('No user found with that email');
      }

      // Create a password reset token
      const token = this.jwtService.sign(
        { email: user.email, sub: user.id },
        { secret: process.env.JWT_RESET_PASSWORD_SECRET, expiresIn: '1h' }
      );

      // Send password reset email
      const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Password Reset',
        template: './reset-password', // use a template for the email (make sure to configure the template engine)
        context: { name: user.lastName, resetUrl }, // pass variables to the template
      });

      return { message: 'Password reset link has been sent to your email' };
    } catch (error) {
      console.log(error)
      throw new error
    }
  }

  async resetPassword(data: ResetPasswordDto) {
    const { token, newPassword, confirmPassword } = data;
    try {
      // Verify the token
      const decoded = this.jwtService.verify(token, { secret: process.env.JWT_RESET_PASSWORD_SECRET });
      const user = await this.prisma.user.findUnique({ where: { id: decoded.sub } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (newPassword !== confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password
      await this.prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: hashedPassword },
      });

      return { message: 'Password successfully reset' };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Password reset token has expired');
      }
      console.log(error)
      throw new InternalServerErrorException(error.message || 'Error resetting password');
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const payload = { email: decoded.email, sub: decoded.sub, roles: decoded.roles };
      const newAccessToken = this.jwtService.sign(payload, {
        expiresIn: '3h',
        secret: process.env.JWT_SECRET,
      });

      return { accessToken: newAccessToken };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid refresh token');
      }
      throw new InternalServerErrorException('Error processing refresh token');
    }
  }
}
