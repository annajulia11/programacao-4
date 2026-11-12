# Banco de Dados — Entidade Pessoa (Usuário)

Documentação da criação da tabela MySQL correspondente à entidade `Pessoa`
do módulo NestJS, com as inserções e a seleção de todos os registros.

- **SGBD:** MySQL / MariaDB
- **Banco:** `nest_pessoa`
- **Tabela:** `pessoa`
- **Script executável:** [`pessoa.sql`](./pessoa.sql)

---

## 1. Entidade de referência

A tabela foi modelada a partir da entidade definida no módulo NestJS:

| Campo (entidade) | Tipo (TS) |
|------------------|-----------|
| `id`             | number    |
| `nome`           | string    |
| `email`          | string    |
| `senha`          | string    |
| `ativo`          | boolean   |
| `criadoEm`       | Date      |
| `atualizadoEm`   | Date      |

> Observação: no banco os campos de data seguem a convenção `snake_case`
> (`criado_em`, `atualizado_em`).

---

## 2. Estrutura da tabela

Definição obtida via `DESCRIBE pessoa;`:

| Field         | Type         | Null | Key | Default             | Extra                         |
|---------------|--------------|------|-----|---------------------|-------------------------------|
| id            | int(11)      | NO   | PRI | NULL                | auto_increment                |
| nome          | varchar(255) | NO   |     | NULL                |                               |
| email         | varchar(255) | NO   | UNI | NULL                |                               |
| senha         | varchar(255) | NO   |     | NULL                |                               |
| ativo         | tinyint(1)   | NO   |     | 1                   |                               |
| criado_em     | datetime     | NO   |     | current_timestamp() |                               |
| atualizado_em | datetime     | NO   |     | current_timestamp() | on update current_timestamp() |

Destaques do esquema:

- `id` — chave primária com `AUTO_INCREMENT`.
- `email` — restrição `UNIQUE` (não permite e-mails duplicados).
- `ativo` — `BOOLEAN` (armazenado como `tinyint(1)`), padrão `TRUE`.
- `criado_em` — preenchido automaticamente na inserção.
- `atualizado_em` — atualizado automaticamente a cada `UPDATE`.

---

## 3. SQL utilizado

### Criação da tabela

```sql
CREATE TABLE pessoa (
  id             INT           NOT NULL AUTO_INCREMENT,
  nome           VARCHAR(255)  NOT NULL,
  email          VARCHAR(255)  NOT NULL,
  senha          VARCHAR(255)  NOT NULL,
  ativo          BOOLEAN       NOT NULL DEFAULT TRUE,
  criado_em      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
                                        ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_pessoa_email (email)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
```

### Inserções (2 registros)

```sql
INSERT INTO pessoa (nome, email, senha, ativo) VALUES
  ('Ana Souza',  'ana@ex.com',   'segredo123',  TRUE);

INSERT INTO pessoa (nome, email, senha, ativo) VALUES
  ('Bruno Lima', 'bruno@ex.com', 'outrasenha',  TRUE);
```

### Seleção de todos os registros

```sql
SELECT * FROM pessoa;
```

---

## 4. Resultado da execução

Saída real do `SELECT * FROM pessoa;`:

```
+----+------------+--------------+------------+-------+---------------------+---------------------+
| id | nome       | email        | senha      | ativo | criado_em           | atualizado_em       |
+----+------------+--------------+------------+-------+---------------------+---------------------+
|  1 | Ana Souza  | ana@ex.com   | segredo123 |     1 | 2026-07-08 19:07:40 | 2026-07-08 19:07:40 |
|  2 | Bruno Lima | bruno@ex.com | outrasenha |     1 | 2026-07-08 19:07:40 | 2026-07-08 19:07:40 |
+----+------------+--------------+------------+-------+---------------------+---------------------+
```

---

## 5. Como reproduzir

```bash
# 1. Acesse o MySQL/MariaDB
mysql -u root -p

# 2. Execute o script completo (cria banco, tabela, insere e seleciona)
mysql -u root -p < database/pessoa.sql
```

---

## 6. Observação de segurança

Neste exercício a `senha` é armazenada em texto puro apenas para fins
didáticos. Em um sistema real ela deve ser gravada como **hash** (por
exemplo, `bcrypt` ou `argon2`) e nunca retornada nas consultas.
