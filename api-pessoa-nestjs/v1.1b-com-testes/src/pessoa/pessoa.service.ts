import { Injectable } from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { Pessoa } from './entities/pessoa.entity';

@Injectable()
export class PessoaService {
  private pessoas: Pessoa[] = [];
  private id = 1;

  create(createPessoaDto: CreatePessoaDto) {
    const novaPessoa: Pessoa = {
      id: this.id++,
      ...createPessoaDto,
    };

    this.pessoas.push(novaPessoa);

    return novaPessoa;
  }

  findAll() {
    return this.pessoas;
  }

  findOne(id: number) {
    return this.pessoas.find((pessoa) => pessoa.id === id);
  }

  update(id: number, updatePessoaDto: UpdatePessoaDto) {
    const pessoa = this.findOne(id);

    if (!pessoa) {
      return 'Pessoa não encontrada';
    }

    Object.assign(pessoa, updatePessoaDto);

    return pessoa;
  }

  remove(id: number) {
    const index = this.pessoas.findIndex(
      (pessoa) => pessoa.id === id,
    );

    if (index === -1) {
      return 'Pessoa não encontrada';
    }

    const removida = this.pessoas[index];

    this.pessoas.splice(index, 1);

    return removida;
  }
}