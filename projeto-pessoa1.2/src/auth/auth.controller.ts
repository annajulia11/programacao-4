import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreatePessoaDto } from '../pessoa/dto/create-pessoa.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/register
  @Post('register')
  register(@Body() createPessoaDto: CreatePessoaDto) {
    return this.authService.register(createPessoaDto);
  }

  // POST /auth/login
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // GET /auth/perfil  (rota protegida — retorna o usuário do token)
  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  perfil(@Request() req) {
    return req.user;
  }
}
