import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service'; 

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body('email') email: string) {
    const usuario = await this.authService.login(email);
    return usuario;
  }
}

