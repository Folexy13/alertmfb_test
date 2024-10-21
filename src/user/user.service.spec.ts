import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../auth/roles/roles.guard';
import { ExecutionContext } from '@nestjs/common';
import { UserService } from '../user/user.service';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;
  let userService: UserService;

  beforeEach(() => {
    reflector = new Reflector();
    userService = new UserService(null); // Mock the user service
    rolesGuard = new RolesGuard(reflector, userService);
  });

  it('should allow access if roles match', async () => {
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user: { id: 1 } }),
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
    jest.spyOn(userService, 'getUserById').mockResolvedValue({
      id: 1,
      roles: [{ id: 0, name: 'admin' }],
    });

    const canActivate = await rolesGuard.canActivate(context);
    expect(canActivate).toBe(true);
  });

  it('should deny access if roles do not match', async () => {
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user: { id: 1 } }),
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
    jest.spyOn(userService, 'findUserById').mockResolvedValue({
      id: 1,
      roles: [{ name: 'user' }],
    });

    const canActivate = await rolesGuard.canActivate(context);
    expect(canActivate).toBe(false);
  });
});
