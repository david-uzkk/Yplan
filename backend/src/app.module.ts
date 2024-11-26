// src/app.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/prisma.service';
import { RoutineModule } from './routines/routine.module'; 

@Module({
  imports: [RoutineModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AppModule {}
