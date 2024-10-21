import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private prisma: PrismaService) { }

  // This method will run automatically when the server starts
  async onModuleInit() {
    console.log('Checking and seeding roles if not present...');
    await this.seedRoles();
    console.log('Roles check and seeding completed.');
  }

  private async seedRoles() {
    // Check if roles already exist
    const roles = ['Admin', 'Moderator', 'User'];

    for (const role of roles) {
      const roleExists = await this.prisma.role.findUnique({
        where: { name: role },
      });

      if (!roleExists) {
        await this.prisma.role.create({
          data: { name: role },
        });
        console.log(`${role} role has been seeded.`);
      } else {
        console.log(`${role} role already exists. Skipping seeding.`);
      }
    }
  }
}
