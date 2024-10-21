import { Controller, Post, Body, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/create.dto';
import path from 'path';
import { Response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("register")
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Get('reset-password')
  resetPasswordPage(@Query('token') token: string, @Res() res: Response) {
    res.render('reset', { token }); // Render the Handlebars template and pass the token
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  // @Post('set-twofa')
  // async setTwoFa(@Body() setTwoFaDto: SetTwoFaDto) {
  //   return this.authService.setTwoFa(setTwoFaDto);
  // }
}
