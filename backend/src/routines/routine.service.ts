import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoutineService {
  constructor(private prisma: PrismaService) {}

  // Atualiza ou cria rotinas com base nos dados fornecidos
  async updateRoutines(rotinas: any[]) {
    const updatePromises = rotinas.map(async (rotina) => {
      const usuarioExistente = await this.prisma.usuario.findUnique({
        where: { id: rotina.usuarioId },
      });

      if (!usuarioExistente) {
        throw new Error(`Usuário com ID ${rotina.usuarioId} não encontrado.`);
      }

      return this.prisma.rotina.upsert({
        where: { id: rotina.id },
        update: {
          nome: rotina.nome,
          exercicios: {
            set: Array.isArray(rotina.exercises)
              ? rotina.exercises.map((exerciseId: number) => ({ id: exerciseId }))
              : [],
          },
        },
        create: {
          nome: rotina.nome,
          usuario: {
            connect: { id: rotina.usuarioId },
          },
          exercicios: {
            connect: Array.isArray(rotina.exercises)
              ? rotina.exercises.map((exerciseId: number) => ({ id: exerciseId }))
              : [],
          },
        },
      });
    });

    return await Promise.all(updatePromises);
  }

  // Retorna todas as rotinas existentes no banco de dados
  async getAllRoutines(userId: number) {
    return this.prisma.rotina.findMany({
      where: { usuarioId: userId },
      include: {
        exercicios: true,
      },
    });
  }

  // Exclui uma rotina com base no ID fornecido
  async deleteRoutine(id: number) {
    return this.prisma.rotina.delete({
      where: {
        id: Number(id),
      },
    });
  }

  // Obtém todos os exercícios disponíveis no banco de dados
  async getAllExercises() {
    return this.prisma.exercicios.findMany();
  }

  // Cria um novo exercício
  async createExercise(exercicio: any) {
    return this.prisma.exercicios.create({
      data: {
        nome: exercicio.nome,
        tipo: exercicio.tipo,
      },
    });
  }

  // Atualiza um exercício existente
  async updateExercise(id: number, exercicio: any) {
    if (isNaN(id)) {
      throw new Error('ID inválido');
    }
  
    try {
      const updatedExercicio = await this.prisma.exercicios.update({
        where: {
          id: id, // Aqui o ID já é tratado como número
        },
        data: {
          nome: exercicio.nome,
          tipo: exercicio.tipo,
        },
      });
      return updatedExercicio;
    } catch (error) {
      throw new Error('Erro ao atualizar o exercício: ' + error.message);
    }
  }  
  

  // Exclui um exercício baseado no ID
  async deleteExercise(id: number) {
    return this.prisma.exercicios.delete({
      where: { id },
    });
  }
}
