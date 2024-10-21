import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../shared/jwt.guard';
import { AssignRoleDto, UpdateUserDto } from './dto/create-user.dto';

// Mock data
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
];

// Mock service
const mockUserService = {
  getUsers: jest.fn().mockResolvedValue(mockUsers),
  getUserByIdOrEmail: jest.fn().mockImplementation((id) => Promise.resolve(mockUsers.find(user => user.id === id))),
  assignRole: jest.fn().mockResolvedValue('Role assigned'),
  update: jest.fn().mockResolvedValue({ id: 1, ...mockUsers[0] }),
  deleteUser: jest.fn().mockResolvedValue('User deleted'),
};

describe('UserController Unit Tests', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    })
      .overrideGuard(RolesGuard) // You can bypass guards in unit tests if necessary
      .useValue({})
      .overrideGuard(JwtAuthGuard)
      .useValue({})
      .compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a list of users', async () => {
    const users = await controller.getUsers();
    expect(users).toEqual(mockUsers);
    expect(service.getUsers).toHaveBeenCalled();
  });

  it('should return a user by id', async () => {
    const user = await controller.getUserById(1);
    expect(user).toEqual(mockUsers[0]);
    expect(service.getUserByIdOrEmail).toHaveBeenCalledWith(1);
  });

  it('should assign a role', async () => {
    const dto: AssignRoleDto = { userId: 1, roleId: 2 };
    const result = await controller.assignRole(dto);
    expect(result).toBe('Role assigned');
    expect(service.assignRole).toHaveBeenCalledWith(dto);
  });

  it('should update a user', async () => {
    const dto: UpdateUserDto = { name: 'Updated Name' };
    const result = await controller.update('1', dto);
    expect(result).toEqual({ id: 1, ...mockUsers[0] });
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should delete a user', async () => {
    const result = await controller.remove('1');
    expect(result).toBe('User deleted');
    expect(service.deleteUser).toHaveBeenCalledWith(1);
  });
});
