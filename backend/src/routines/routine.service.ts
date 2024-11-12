// src/routines/routine.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoutineService {
  constructor(private prisma: PrismaService) {}

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

  async getAllRoutines() {
    return this.prisma.rotina.findMany();
  }

  // Corrigir a exclusão para garantir que id é um número
  async deleteRoutine(id: number) {
    return this.prisma.rotina.delete({
      where: {
        id: Number(id), // Converte o id para um número
      },
    });
  }
}
