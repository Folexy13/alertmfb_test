import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../database/prisma.services';
import { AssignRoleDto, UpdateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }


  async getUsers() {
    return this.prisma.user.findMany(
      {
        include: {
          roles: true, // Include related permissions for each role
        },
      }
    );
  }

  async getUserByIdOrEmail(filter: number | string) {
    const query = typeof filter === 'number'
      ? { id: filter }  // If the filter is a number, search by ID
      : { email: filter };  // If the filter is a string, search by email

    return this.prisma.user.findUnique({
      where: query,  // Dynamically search by id or email
      include: {
        roles: true
      },

    });
  }


  async updateUser(id: number, updateUserDto: UpdateUserDto, currentUser: any) {

    try {
      // Fetch the user to be updated
      const userToUpdate = await this.prisma.user.findUnique({ where: { id } });
      if (!userToUpdate) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Check if the current user is the owner or an admin
      if (currentUser.id !== id && !currentUser.roles.includes('ADMIN')) {
        throw new ForbiddenException('You do not have permission to edit this user');
      }

      // Proceed with the update if the user is authorized
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          ...updateUserDto, // Spread the updateUserDto to include the updated fields
        },
      });

      return updatedUser;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error;
    }
  }

  async deleteUser(userId: number): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({ where: { id: userId } });

    return { message: 'User account deleted successfully' };
  }


  async assignRole(data: AssignRoleDto) {
    // Fetch the user along with their roles
    const user = await this.getUserByIdOrEmail(data.userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Check if the role already exists in the user's roles
    const hasRole = user.roles.some((role) => role.id === data.roleId);

    if (hasRole) {
      // If the user already has the role, return the user without modifying roles
      return user;
    }

    // If the role is not assigned, add it to the user's roles
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        roles: {
          connect: { id: data.roleId },  // Connect the new role to the user
        },
      },
      include: {
        roles: true,  // Include roles in the returned user
      },
    });

    // Return the updated user
    return this.getUserByIdOrEmail(data.userId);
  }

  async getRoles() {
    return this.prisma.role.findMany();
  }


}
