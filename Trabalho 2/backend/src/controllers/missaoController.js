// ─────────────────────────────────────────────
// Controller de Missões — CRUD completo
// Regras de negócio:
//  - titulo e conteudo (descrição) são obrigatórios
//  - rank deve ser um dos ranks ninja: D, C, B, A ou S
//  - ordem define a prioridade no Mural de Missões
//    (a listagem sempre retorna ORDER BY ordem)
// ─────────────────────────────────────────────
const db = require('../database/db');

const RANKS_VALIDOS = ['D', 'C', 'B', 'A', 'S'];

function validarMissao({ titulo, conteudo, rank, ordem }) {
  if (!titulo || !String(titulo).trim()) return 'O campo "titulo" é obrigatório.';
  if (!conteudo || !String(conteudo).trim()) return 'O campo "conteudo" é obrigatório.';
  if (rank !== undefined && !RANKS_VALIDOS.includes(String(rank).toUpperCase())) {
    return `Rank inválido. Use um dos ranks ninja: ${RANKS_VALIDOS.join(', ')}.`;
  }
  if (ordem !== undefined && ordem !== null && Number.isNaN(Number(ordem))) {
    return 'O campo "ordem" deve ser numérico.';
  }
  return null;
}

// GET /api/missoes — mural ordenado pela prioridade (ordem)
function listar(req, res) {
  const missoes = db
    .prepare('SELECT * FROM missoes ORDER BY ordem ASC, id ASC')
    .all();
  return res.json(missoes);
}

// GET /api/missoes/:id
function buscar(req, res) {
  const missao = db.prepare('SELECT * FROM missoes WHERE id = ?').get(req.params.id);
  if (!missao) return res.status(404).json({ erro: 'Missão não encontrada.' });
  return res.json(missao);
}

// POST /api/missoes
function criar(req, res) {
  const { titulo, rank, conteudo, imagem, ordem } = req.body || {};

  const erro = validarMissao({ titulo, conteudo, rank, ordem });
  if (erro) return res.status(400).json({ erro });

  const info = db
    .prepare('INSERT INTO missoes (titulo, rank, conteudo, imagem, ordem) VALUES (?, ?, ?, ?, ?)')
    .run(
      titulo,
      String(rank || 'D').toUpperCase(),
      conteudo,
      imagem || null,
      Number(ordem) || 0
    );

  const criada = db.prepare('SELECT * FROM missoes WHERE id = ?').get(info.lastInsertRowid);
  return res.status(201).json(criada);
}

// PUT /api/missoes/:id
function atualizar(req, res) {
  const existente = db.prepare('SELECT * FROM missoes WHERE id = ?').get(req.params.id);
  if (!existente) return res.status(404).json({ erro: 'Missão não encontrada.' });

  const { titulo, rank, conteudo, imagem, ordem } = { ...existente, ...req.body };

  const erro = validarMissao({ titulo, conteudo, rank, ordem });
  if (erro) return res.status(400).json({ erro });

  db.prepare(
    'UPDATE missoes SET titulo = ?, rank = ?, conteudo = ?, imagem = ?, ordem = ? WHERE id = ?'
  ).run(
    titulo,
    String(rank || 'D').toUpperCase(),
    conteudo,
    imagem || null,
    Number(ordem) || 0,
    req.params.id
  );

  const atualizada = db.prepare('SELECT * FROM missoes WHERE id = ?').get(req.params.id);
  return res.json(atualizada);
}

// DELETE /api/missoes/:id
function remover(req, res) {
  const info = db.prepare('DELETE FROM missoes WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ erro: 'Missão não encontrada.' });
  return res.status(204).send();
}

module.exports = { listar, buscar, criar, atualizar, remover, RANKS_VALIDOS };
