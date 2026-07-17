// ─────────────────────────────────────────────
// Conexão e criação das tabelas (SQLite)
// ─────────────────────────────────────────────
const Database = require('better-sqlite3');
const path = require('path');

// Em testes usamos um banco em memória (NODE_ENV=test)
const dbPath =
  process.env.NODE_ENV === 'test'
    ? ':memory:'
    : process.env.DB_PATH || path.join(__dirname, '..', '..', 'wiki.db');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Tabela de usuários (Requisito D — Autenticação JWT)
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nome      TEXT    NOT NULL,
    email     TEXT    NOT NULL UNIQUE,
    senha     TEXT    NOT NULL,
    criado_em TEXT    DEFAULT (datetime('now'))
  );
`);

// Tabela de missões — entidade de conteúdo (Requisito 2)
//   titulo   → Título da missão
//   conteudo → Descrição da missão
//   imagem   → URL do elemento visual
//   ordem    → Ordenação de Apresentação (prioridade no mural)
//   rank     → Rank ninja da missão (D, C, B, A ou S)
db.exec(`
  CREATE TABLE IF NOT EXISTS missoes (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo    TEXT    NOT NULL,
    rank      TEXT    NOT NULL DEFAULT 'D',
    conteudo  TEXT    NOT NULL,
    imagem    TEXT,
    ordem     INTEGER NOT NULL DEFAULT 0,
    criado_em TEXT    DEFAULT (datetime('now'))
  );
`);

// Tabela de aldeias — dados que antes eram "mockados" no script.js
db.exec(`
  CREATE TABLE IF NOT EXISTS aldeias (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    chave          TEXT    NOT NULL UNIQUE,
    nome           TEXT    NOT NULL,
    kanji          TEXT,
    sub            TEXT,
    kage           TEXT,
    kage_atual     TEXT,
    cor            TEXT,
    emoji          TEXT,
    simbolo        TEXT,
    fundacao       TEXT,
    descricao      TEXT,
    especialidades TEXT,   -- JSON (array de strings)
    ninjas         TEXT,   -- JSON (array de strings)
    ordem          INTEGER NOT NULL DEFAULT 0
  );
`);

module.exports = db;
