import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AssignRoleDto, UpdateUserDto } from './dto/create-user.dto';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RequestWithUser } from 'src/interface';


@Controller('users')

export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async getUsers() {
    return this.userService.getUsers();
  }

  @Get('roles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  async getRoles() {
    return this.userService.getRoles();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  async getUserById(@Param('id') id: number) {
    return this.userService.getUserByIdOrEmail(+id);
  }

  //only ADMIN
  @Post('assign-role') //edit role,create role, delete role
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async assignRole(@Body() assignRoleDto: AssignRoleDto) {
    return this.userService.assignRole(assignRoleDto);
  }


  // //only ADMIN
  // @Post('disable-user')
  // async assignRole(@Body() assignRoleDto: AssignRoleDto) {
  //   return this.userService.assignRole(assignRoleDto);
  // }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: RequestWithUser) {
    const { user: currentUser } = req;
    return this.userService.updateUser(+id, updateUserDto, currentUser);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(+id);
  }
}
