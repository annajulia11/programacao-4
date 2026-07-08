# nest-pessoa

API NestJS com módulo de Usuário (`pessoa`), persistência via **TypeORM + MySQL**
e autenticação **JWT**.

## Stack

- NestJS 10
- TypeORM + MySQL/MariaDB (`mysql2`)
- JWT (`@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`)
- Hash de senha com `bcrypt`
- Validação com `class-validator`

## Estrutura

```
src/
├── main.ts                     # bootstrap + ValidationPipe global
├── app.module.ts               # ConfigModule + TypeOrmModule + módulos
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts      # /auth/register, /auth/login, /auth/perfil
│   ├── auth.service.ts         # valida credenciais, emite JWT
│   ├── dto/login.dto.ts
│   ├── strategies/jwt.strategy.ts
│   └── guards/jwt-auth.guard.ts
└── pessoa/
    ├── pessoa.module.ts
    ├── pessoa.controller.ts    # CRUD protegido por JWT
    ├── pessoa.service.ts       # repositório TypeORM + bcrypt
    ├── entities/pessoa.entity.ts
    └── dto/{create,update}-pessoa.dto.ts
database/
└── pessoa.sql                  # script SQL manual equivalente (referência)
```

## Configuração

Copie `.env.example` para `.env` e ajuste os valores:

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=nestuser
DB_PASSWORD=nestpass
DB_DATABASE=nest_pessoa

JWT_SECRET=defina-um-segredo-forte
JWT_EXPIRES_IN=3600s
```

> `synchronize: true` está habilitado (cria as tabelas automaticamente a partir
> das entidades). Ideal para desenvolvimento; em produção use **migrations**.

## Executando

```bash
npm install
npm run start:dev
```

## Endpoints

### Autenticação (públicos)

| Método | Rota             | Descrição                          |
|--------|------------------|------------------------------------|
| POST   | `/auth/register` | Cria usuário e retorna um token    |
| POST   | `/auth/login`    | Autentica e retorna `access_token` |
| GET    | `/auth/perfil`   | Dados do usuário do token (protegido) |

### Usuário / CRUD (exigem `Authorization: Bearer <token>`)

| Método | Rota           | Descrição            |
|--------|----------------|----------------------|
| POST   | `/pessoa`      | Cria usuário         |
| GET    | `/pessoa`      | Lista todos          |
| GET    | `/pessoa/:id`  | Busca por id         |
| PATCH  | `/pessoa/:id`  | Atualiza             |
| DELETE | `/pessoa/:id`  | Remove (204)         |

## Exemplos

```bash
# Registrar
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Ana Souza","email":"ana@ex.com","senha":"segredo123"}'

# Login (guarde o access_token)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@ex.com","senha":"segredo123"}'

# Acessar rota protegida
curl http://localhost:3000/pessoa \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Segurança

- Senhas são armazenadas com **hash bcrypt** (nunca em texto puro).
- A coluna `senha` usa `select: false`, então não é retornada nas consultas.
- Todas as rotas de `/pessoa` são protegidas pelo `JwtAuthGuard`.
