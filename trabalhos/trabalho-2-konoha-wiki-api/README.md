# 🍥 Konoha Wiki — Integração Front-end e Back-end (Trabalho 2)

Evolução do Trabalho 1 (wiki estática de Naruto Shippūden) para um ecossistema dinâmico: o front-end não consome mais dados mockados — todo o conteúdo de **aldeias** e do **Mural de Missões** é buscado de uma **API REST** protegida por **autenticação JWT** e persistido em um banco **SQLite**.

## Estrutura do projeto

```
├── backend/                  # API REST (Node.js + Express + SQLite)
│   ├── src/
│   │   ├── app.js            # Configuração do Express e das rotas
│   │   ├── server.js         # Inicialização do servidor HTTP
│   │   ├── database/
│   │   │   ├── db.js         # Conexão SQLite + criação das tabelas
│   │   │   └── seed.js       # Popula o banco (usuário, missões, aldeias)
│   │   ├── middleware/
│   │   │   └── auth.js       # Geração e verificação de tokens JWT
│   │   ├── controllers/      # Regras de negócio (auth, missões, aldeias)
│   │   └── routes/           # Mapeamento das rotas da API
│   ├── tests/                # Testes unitários (Jest + Supertest)
│   ├── .env.example          # Modelo de variáveis de ambiente
│   └── package.json
├── frontend/                 # Front-end do Trabalho 1, agora dinâmico
│   ├── index.html
│   ├── estilo.css
│   ├── script.js             # Efeitos visuais + modal (dados via API)
│   └── api.js                # Integração: fetch, JWT, renderização e CRUD
└── README.md
```

## Tecnologias

| Camada | Tecnologias |
|---|---|
| Back-end | Node.js, Express, better-sqlite3, jsonwebtoken, bcryptjs, cors, dotenv |
| Banco de dados | SQLite (arquivo `wiki.db`; em memória durante os testes) |
| Testes | Jest + Supertest |
| Front-end | HTML, CSS e JavaScript puro (`fetch` assíncrono) |

## Esquema do banco de dados

**`missoes`** — entidade de conteúdo (Requisito 2)

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | INTEGER (PK) | Identificador |
| `titulo` | TEXT (obrigatório) | Título da missão |
| `rank` | TEXT (obrigatório) | Rank ninja da missão: `D`, `C`, `B`, `A` ou `S` (validado pela API) |
| `conteudo` | TEXT (obrigatório) | Descrição da missão |
| `imagem` | TEXT | URL do elemento visual |
| `ordem` | INTEGER | **Ordenação de apresentação** (prioridade no mural) — a listagem retorna `ORDER BY ordem ASC` |
| `criado_em` | TEXT | Data de criação |

**`usuarios`** — entidade para autenticação JWT (Requisito D)

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | INTEGER (PK) | Identificador |
| `nome` | TEXT | Nome do usuário |
| `email` | TEXT (único) | Login |
| `senha` | TEXT | Hash bcrypt (nunca é retornada pela API) |

**`aldeias`** — dados das cinco grandes aldeias, que antes eram mockados no `script.js` do Trabalho 1 e agora vêm do banco.

## Instalação e execução

Pré-requisito: **Node.js 18+**.

```bash
# 1. Instalar dependências do back-end
cd backend
npm install

# 2. (Opcional) Configurar variáveis de ambiente
cp .env.example .env     # edite JWT_SECRET, PORT etc.

# 3. Popular o banco de dados
npm run seed
#   → cria o usuário padrão: admin@konoha.com / rasengan123
#   → insere as 6 missões do mural e as 5 aldeias

# 4. Iniciar a API (http://localhost:3000)
npm start                # ou: npm run dev (reinicia ao salvar)
```

Para o front-end, sirva a pasta `frontend/` com qualquer servidor estático, por exemplo:

```bash
cd ../frontend
npx serve .              # ou: python3 -m http.server 8080
```

Abra o endereço indicado no navegador. A tela de login aparece primeiro (as rotas da API exigem autenticação); entre com o usuário do seed ou crie uma conta na aba "Criar conta".

## Executando os testes

```bash
cd backend
npm test
```

A suíte (Jest + Supertest) usa um banco **em memória** e cobre:

- Registro de usuário (validações, e-mail duplicado, senha curta);
- Login com credenciais corretas e incorretas;
- Bloqueio (401) das rotas de dados sem token ou com token inválido;
- CRUD completo de missões (validações de título/descrição, 404, preservação de campos no PUT);
- Regra de negócio do **rank** (rejeita ranks fora de D/C/B/A/S, normaliza minúsculas, aplica o padrão D);
- Regra de negócio da **ordenação de apresentação** (mural sempre ordenado por `ordem`/prioridade).

## Endpoints da API

Base: `http://localhost:3000/api`

### Autenticação (`/auth`) — rotas públicas

| Método | Rota | Corpo | Resposta |
|---|---|---|---|
| POST | `/auth/registrar` | `{ nome, email, senha }` | `201` → `{ usuario, token }` |
| POST | `/auth/login` | `{ email, senha }` | `200` → `{ usuario, token }` |
| GET | `/auth/eu` 🔒 | — | `200` → `{ usuario }` (dados do token) |

### Missões (`/missoes`) — 🔒 todas exigem `Authorization: Bearer <token>`

| Método | Rota | Corpo | Resposta |
|---|---|---|---|
| GET | `/missoes` | — | `200` → mural ordenado por `ordem` (prioridade) |
| GET | `/missoes/:id` | — | `200` ou `404` |
| POST | `/missoes` | `{ titulo*, rank (D/C/B/A/S), conteudo*, imagem, ordem }` | `201` → missão criada |
| PUT | `/missoes/:id` | campos a alterar (parcial) | `200` → missão atualizada |
| DELETE | `/missoes/:id` | — | `204` ou `404` |

### Aldeias (`/aldeias`) — 🔒 exigem token

| Método | Rota | Resposta |
|---|---|---|
| GET | `/aldeias` | `200` → lista ordenada |
| GET | `/aldeias/:chave` | `200` ou `404` (ex.: `/aldeias/konoha`) |

### Utilitário

| Método | Rota | Resposta |
|---|---|---|
| GET | `/status` | `200` → `{ status: "ok" }` (pública, para verificar se a API está no ar) |

**Erros** são sempre retornados como `{ "erro": "mensagem" }` com o status HTTP adequado (`400`, `401`, `404`, `409`).

### Exemplo com `curl`

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@konoha.com","senha":"rasengan123"}'

# Listar missões (substitua <TOKEN> pelo token retornado)
curl http://localhost:3000/api/missoes -H "Authorization: Bearer <TOKEN>"

# Publicar missão
curl -X POST http://localhost:3000/api/missoes \
  -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
  -d '{"titulo":"Patrulhar os portões","rank":"C","conteudo":"Vigiar a entrada da vila.","ordem":7}'
```

## Como o front-end ficou dinâmico

- `api.js` centraliza a comunicação: guarda o token JWT (`sessionStorage`), injeta o header `Authorization` em cada `fetch` e trata expiração de token (volta ao login).
- **Aldeias**: os cards e o modal são renderizados a partir de `GET /api/aldeias` (o objeto `ALDEIAS_DATA`, que era mockado, foi removido do `script.js`).
- **Mural de Missões**: os cartões de missão são renderizados a partir de `GET /api/missoes`, respeitando o campo `ordem` (prioridade) e exibindo o rank com cores próprias (D cinza → S vermelho).
- **Gerenciar**: seção "Escritório da Hokage" com formulário e listagem que executa `POST`, `PUT` e `DELETE` — as mudanças aparecem imediatamente no mural.

---
Feito por **Anna Júlia** · Trabalho 2 — Integração Front-end e Back-end
