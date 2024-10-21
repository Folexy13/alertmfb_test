import { IsString, IsEmail, IsNotEmpty, MinLength, IsNumber } from 'class-validator';

export class CreateUserDto { }
export class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    isActive?: boolean;
    passwordHash?: string;
}

export class AssignRoleDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number;
    roleId: number;
}