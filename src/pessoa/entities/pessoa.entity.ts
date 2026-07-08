/**
 * Entidade que representa um Usuário do sistema.
 * (arquivo mantido como pessoa.entity para preservar a estrutura do módulo)
 */
export class Pessoa {
  id: number;
  nome: string;
  email: string;
  senha: string;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;

  constructor(partial: Partial<Pessoa>) {
    Object.assign(this, partial);
  }
}
