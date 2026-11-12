import { Injectable } from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { Pessoa } from './entities/pessoa.entity';

@Injectable()
export class PessoaService {
  private pessoas: Pessoa[] = [];
  private idCounter = 1;

  create(createPessoaDto: CreatePessoaDto): Pessoa {
    const pessoa: Pessoa = { id: this.idCounter++, ...createPessoaDto };
    this.pessoas.push(pessoa);
    return pessoa;
  }

  findAll(): Pessoa[] {
    return this.pessoas;
  }

  findOne(id: number): Pessoa | undefined {
    return this.pessoas.find((p) => p.id === id);
  }

  update(id: number, updatePessoaDto: UpdatePessoaDto): Pessoa | undefined {
    const pessoa = this.findOne(id);
    if (pessoa) {
      Object.assign(pessoa, updatePessoaDto);
    }
    return pessoa;
  }

  remove(id: number): Pessoa | null {
    const index = this.pessoas.findIndex((p) => p.id === id);
    if (index !== -1) {
      const removed = this.pessoas[index];
      this.pessoas.splice(index, 1);
      return removed;
    }
    return null;
  }
}
