-- Criar o banco de dados
CREATE DATABASE IF NOT EXISTS prog4_db;

-- Usar o banco de dados
USE prog4_db;

-- Criar a tabela pessoa
CREATE TABLE IF NOT EXISTS pessoa (
    id    INT          NOT NULL AUTO_INCREMENT,
    nome  VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    idade INT          NOT NULL,
    PRIMARY KEY (id)
);

-- Inserir dois registros
INSERT INTO pessoa (nome, email, idade) VALUES ('Ana Silva', 'ana.silva@email.com', 28);
INSERT INTO pessoa (nome, email, idade) VALUES ('Carlos Souza', 'carlos.souza@email.com', 35);

-- Selecionar todos os registros
SELECT * FROM pessoa;
