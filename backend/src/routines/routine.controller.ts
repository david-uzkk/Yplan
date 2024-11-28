import { Controller, Patch, Body, Get, Delete, Param, Post, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { RoutineService } from './routine.service';
import { exerciseSchema } from './schemas/exercise.schema';

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
    const parsed = exerciseSchema.safeParse(exercicio);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors);
    }
    return this.routineService.createExercise(exercicio);
  }

  @Patch('/exercises/:id')
  async updateExercise(
    @Param('id', ParseIntPipe) id: number,
    @Body() exercicio: any
  ) {
    const parsed = exerciseSchema.safeParse(exercicio);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.errors); 
    }
    return this.routineService.updateExercise(id, exercicio);
  }

  @Delete('/exercises/:id')
  async deleteExercise(@Param('id', ParseIntPipe) id: number) {
    return this.routineService.deleteExercise(id);
  }
}
