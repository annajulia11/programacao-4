# API de Pessoas — NestJS

API REST de cadastro de pessoas construída em NestJS ao longo das aulas. Cada pasta é uma etapa da evolução do projeto, do esqueleto inicial até a versão com banco MySQL e login com JWT.

| Versão | O que mudou |
|---|---|
| [`v0-estrutura-inicial`](v0-estrutura-inicial/) | Projeto criado com o Nest CLI e o módulo `pessoa` vazio. |
| [`v1.0-crud-basico`](v1.0-crud-basico/) | Controller e service com as rotas de CRUD, dados guardados em memória. |
| [`v1.1-dto-e-entidade`](v1.1-dto-e-entidade/) | DTOs de criação/atualização e a entidade `Pessoa`. |
| [`v1.1b-com-testes`](v1.1b-com-testes/) | Mesma etapa da v1.1, gerada com o `nest g resource`, incluindo os arquivos de teste (`*.spec.ts`). |
| [`v1.2-mysql-e-jwt`](v1.2-mysql-e-jwt/) | Persistência em MySQL com TypeORM e autenticação JWT (registro, login e rotas protegidas). |

## Rodando qualquer versão

```bash
cd api-pessoa-nestjs/<versão>
npm install
npm run start:dev
```

A API sobe em `http://localhost:3000`.

## Versão final (v1.2)

Antes de rodar, crie o banco e o arquivo de ambiente:

```bash
mysql -u root -p < database/pessoa.sql
cp .env.example .env   # e ajuste usuário, senha e JWT_SECRET
```

| Método | Rota | Protegida |
|---|---|---|
| POST | `/auth/register` | Não |
| POST | `/auth/login` | Não |
| GET | `/auth/perfil` | Sim |
| POST | `/pessoa` | Sim |
| GET | `/pessoa` | Sim |
| GET | `/pessoa/:id` | Sim |
| PATCH | `/pessoa/:id` | Sim |
| DELETE | `/pessoa/:id` | Sim |

Nas rotas protegidas, envie o cabeçalho `Authorization: Bearer <token>` com o token recebido no login.
