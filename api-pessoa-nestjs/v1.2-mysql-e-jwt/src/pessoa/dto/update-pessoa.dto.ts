import { PartialType } from '@nestjs/mapped-types';
import { CreatePessoaDto } from './create-pessoa.dto';

/**
 * Dados de entrada para atualização de um Usuário.
 * Todos os campos de CreatePessoaDto tornam-se opcionais.
 */
export class UpdatePessoaDto extends PartialType(CreatePessoaDto) {}
