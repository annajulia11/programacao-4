CREATE DATABASE IF NOT EXISTS nest_pessoa
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE nest_pessoa;

-- Garante um estado limpo ao reexecutar o script
DROP TABLE IF EXISTS pessoa;

-- Tabela: pessoa
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

-- Inserções (2 registros)
INSERT INTO pessoa (nome, email, senha, ativo) VALUES
  ('Ana Souza',  'ana@ex.com',   'segredo123',  TRUE);

INSERT INTO pessoa (nome, email, senha, ativo) VALUES
  ('Bruno Lima', 'bruno@ex.com', 'outrasenha',  TRUE);

-- -------------------------------------------------------------
-- Seleção de todos os registros
-- -------------------------------------------------------------
SELECT * FROM pessoa;
