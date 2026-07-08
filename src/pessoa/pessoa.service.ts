import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { Pessoa } from './entities/pessoa.entity';

@Injectable()
export class PessoaService {
  /** Armazenamento em memória. Trocar por um repositório (TypeORM/Prisma) quando houver banco. */
  private readonly pessoas: Pessoa[] = [];
  private proximoId = 1;

  create(createPessoaDto: CreatePessoaDto): Pessoa {
    const agora = new Date();
    const pessoa = new Pessoa({
      id: this.proximoId++,
      ...createPessoaDto,
      ativo: createPessoaDto.ativo ?? true,
      criadoEm: agora,
      atualizadoEm: agora,
    });

    this.pessoas.push(pessoa);
    return pessoa;
  }

  findAll(): Pessoa[] {
    return this.pessoas;
  }

  findOne(id: number): Pessoa {
    const pessoa = this.pessoas.find((p) => p.id === id);

    if (!pessoa) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado.`);
    }

    return pessoa;
  }

  update(id: number, updatePessoaDto: UpdatePessoaDto): Pessoa {
    const pessoa = this.findOne(id);

    Object.assign(pessoa, updatePessoaDto, { atualizadoEm: new Date() });
    return pessoa;
  }

  remove(id: number): void {
    const indice = this.pessoas.findIndex((p) => p.id === id);

    if (indice === -1) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado.`);
    }

    this.pessoas.splice(indice, 1);
  }
}
