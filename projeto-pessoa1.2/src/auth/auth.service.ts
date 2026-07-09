import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PessoaService } from '../pessoa/pessoa.service';
import { CreatePessoaDto } from '../pessoa/dto/create-pessoa.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly pessoaService: PessoaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registra um novo usuário (senha é hasheada pelo PessoaService).
   */
  async register(createPessoaDto: CreatePessoaDto) {
    const pessoa = await this.pessoaService.create(createPessoaDto);
    return this.gerarToken(pessoa.id, pessoa.email);
  }

  /**
   * Valida credenciais e retorna um access_token.
   */
  async login(loginDto: LoginDto) {
    const pessoa = await this.pessoaService.findByEmailComSenha(loginDto.email);

    if (!pessoa || !(await bcrypt.compare(loginDto.senha, pessoa.senha))) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    if (!pessoa.ativo) {
      throw new UnauthorizedException('Usuário inativo.');
    }

    return this.gerarToken(pessoa.id, pessoa.email);
  }

  private gerarToken(id: number, email: string) {
    const payload = { sub: id, email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
