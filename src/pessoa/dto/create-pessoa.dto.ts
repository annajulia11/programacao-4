import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

/**
 * Dados de entrada para criação de um Usuário.
 */
export class CreatePessoaDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  senha: string;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
