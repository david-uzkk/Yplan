import { Controller, Patch, Body, Get, Delete, Param, Post, ParseIntPipe } from '@nestjs/common';
import { RoutineService } from './routine.service';

@Controller('api/routines')
export class RoutineController {
  constructor(private readonly routineService: RoutineService) {}

  @Patch('update')
  async updateRoutines(@Body('rotinas') routines: any[]) {
    return this.routineService.updateRoutines(routines);
  }

  @Get()
  async getRoutines(@Param('userId') userId: number) {
    return this.routineService.getAllRoutines(userId);
  }

  @Delete(':id')
  async deleteRoutine(@Param('id') id: number) {
    return this.routineService.deleteRoutine(id);
  }

  @Get('/exercises')
  async getExercises() {
    return this.routineService.getAllExercises();
  }

  @Post('/exercises')
  async createExercise(@Body() exercicio: any) {
    return this.routineService.createExercise(exercicio);
  }

  @Patch('/exercises/:id')
  async updateExercise(
    @Param('id', ParseIntPipe) id: number, // Converte o id para número automaticamente
    @Body() exercicio: any
  ) {
    return this.routineService.updateExercise(id, exercicio);
  }
  

  @Delete('/exercises/:id')
  async deleteExercise(@Param('id', ParseIntPipe) id: number) {
    return this.routineService.deleteExercise(id);
  }
  
}
