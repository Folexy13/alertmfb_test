// src/seed/seed.module.ts
import { Module } from '@nestjs/common';
import { SeedService, PrismaService } from './prisma.services';

@Module({
  providers: [SeedService],
})
export class SeedModule { }
