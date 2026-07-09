import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { Pessoa } from './entities/pessoa.entity';

@Injectable()
export class PessoaService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
  ) {}

  async create(createPessoaDto: CreatePessoaDto): Promise<Pessoa> {
    const existente = await this.pessoaRepository.findOne({
      where: { email: createPessoaDto.email },
    });
    if (existente) {
      throw new ConflictException('Já existe um usuário com este e-mail.');
    }

    const senhaHash = await bcrypt.hash(createPessoaDto.senha, 10);

    const pessoa = this.pessoaRepository.create({
      ...createPessoaDto,
      senha: senhaHash,
      ativo: createPessoaDto.ativo ?? true,
    });

    const salva = await this.pessoaRepository.save(pessoa);
    // Remove a senha do objeto retornado.
    delete (salva as Partial<Pessoa>).senha;
    return salva;
  }

  findAll(): Promise<Pessoa[]> {
    // senha tem select:false, então não é retornada aqui.
    return this.pessoaRepository.find();
  }

  async findOne(id: number): Promise<Pessoa> {
    const pessoa = await this.pessoaRepository.findOne({ where: { id } });
    if (!pessoa) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado.`);
    }
    return pessoa;
  }

  /**
   * Busca por e-mail incluindo a senha (usado pela autenticação).
   */
  findByEmailComSenha(email: string): Promise<Pessoa | null> {
    return this.pessoaRepository
      .createQueryBuilder('pessoa')
      .addSelect('pessoa.senha')
      .where('pessoa.email = :email', { email })
      .getOne();
  }

  async update(id: number, updatePessoaDto: UpdatePessoaDto): Promise<Pessoa> {
    if (updatePessoaDto.senha) {
      updatePessoaDto.senha = await bcrypt.hash(updatePessoaDto.senha, 10);
    }

    const pessoa = await this.pessoaRepository.preload({
      id,
      ...updatePessoaDto,
    });
    if (!pessoa) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado.`);
    }

    const salva = await this.pessoaRepository.save(pessoa);
    delete (salva as Partial<Pessoa>).senha;
    return salva;
  }

  async remove(id: number): Promise<void> {
    const resultado = await this.pessoaRepository.delete(id);
    if (!resultado.affected) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado.`);
    }
  }
}
