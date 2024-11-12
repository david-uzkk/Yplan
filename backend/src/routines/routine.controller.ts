// src/routines/routine.controller.ts
import { Controller, Patch, Body, Get, Delete, Param } from '@nestjs/common';
import { RoutineService } from './routine.service';

@Controller('api/routines')
export class RoutineController {
  constructor(private readonly routineService: RoutineService) {}

  @Patch('update')
  async updateRoutines(@Body('rotinas') routines: any[]) {
    return this.routineService.updateRoutines(routines);
  }

  @Get()
  async getRoutines() {
    return this.routineService.getAllRoutines();
  }

  @Delete(':id')
  async deleteRoutine(@Param('id') id: number) {
    return this.routineService.deleteRoutine(id);
  }
}
