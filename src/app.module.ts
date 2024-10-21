import { Module } from '@nestjs/common';
import { PrismaService, SeedService } from './prisma/prisma.services';
import { UserService } from './user/user.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';


@Module({
  imports: [AuthModule, UserModule, MailerModule.forRoot({
    transport: {
      host: 'smtp.gmail.com', // Replace with your email provider details
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    },
    defaults: {
      from: '"No Reply" <folajimiopeyemisax13@example.com>',
    },
    template: {
      dir: join(__dirname, "..", 'src/templates'),
      adapter: new HandlebarsAdapter(), // or another template engine
      options: {
        strict: true,
      },
    },
  }),],
  providers: [
    PrismaService,
    SeedService,
    UserService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [],
})
export class AppModule { }
