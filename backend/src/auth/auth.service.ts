import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Certifique-se de que o caminho está correto

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(email: string) {
    let usuario = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      usuario = await this.prisma.usuario.create({
        data: { email },
      });
    }

    return usuario;
  }
  
}
