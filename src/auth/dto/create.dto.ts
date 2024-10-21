import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';


export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstName: string; // User's first name

    @IsString()
    @IsNotEmpty()
    lastName: string; // User's last name

    @IsEmail()
    @IsNotEmpty()
    email: string; // User's email for authentication

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    passwordHash: string;
}



export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string; // User's email for login

    @IsString()
    @IsNotEmpty()
    passwordHash: string; // User's password for login
}

export class ForgotPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    email: string; // User's email for password reset request
}

export class ResetPasswordDto {
    @IsString()
    @IsNotEmpty()
    token: string; // Token sent via email for resetting the password


    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    newPassword: string; // New password for the user
    confirmPassword: string
}
