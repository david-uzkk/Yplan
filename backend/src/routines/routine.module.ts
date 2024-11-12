// src/routines/routine.module.ts
import { Module } from '@nestjs/common';
import { RoutineService } from './routine.service';
import { RoutineController } from './routine.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [RoutineController],
  providers: [RoutineService, PrismaService],
})
export class RoutineModule {}
