import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoutineService {
  constructor(private prisma: PrismaService) {}

  // Atualiza ou cria rotinas com base nos dados fornecidos
  async updateRoutines(rotinas: any[]) {
    const updatePromises = rotinas.map((rotina) =>
      this.prisma.rotina.upsert({
        where: { id: rotina.id },
        update: { nome: rotina.nome },
        create: {
          nome: rotina.nome,
          usuario: {
            connect: { id: rotina.usuarioId },
          },
        },
      }),
    );
    return await Promise.all(updatePromises);
  }

  // Retorna todas as rotinas existentes no banco de dados
  async getAllRoutines() {
    return this.prisma.rotina.findMany({
      include: {
        exercicios: true, // Inclui os exercícios associados à rotina
      },
    });
  }

  // Exclui uma rotina com base no ID fornecido
  async deleteRoutine(id: number) {
    return this.prisma.rotina.delete({
      where: {
        id: Number(id), // Converte o id para um número
      },
    });
  }

  // Obtém todos os exercícios disponíveis no banco de dados
  async getAllExercises() {
    return this.prisma.exercicios.findMany();
  }
}
