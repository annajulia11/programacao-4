// ─────────────────────────────────────────────
// Controller de Aldeias — dados que antes eram
// "mockados" no front agora vêm do banco.
// ─────────────────────────────────────────────
const db = require('../database/db');

function parse(aldeia) {
  return {
    ...aldeia,
    especialidades: JSON.parse(aldeia.especialidades || '[]'),
    ninjas: JSON.parse(aldeia.ninjas || '[]'),
  };
}

// GET /api/aldeias
function listar(req, res) {
  const aldeias = db.prepare('SELECT * FROM aldeias ORDER BY ordem ASC, id ASC').all();
  return res.json(aldeias.map(parse));
}

// GET /api/aldeias/:chave
function buscar(req, res) {
  const aldeia = db.prepare('SELECT * FROM aldeias WHERE chave = ?').get(req.params.chave);
  if (!aldeia) return res.status(404).json({ erro: 'Aldeia não encontrada.' });
  return res.json(parse(aldeia));
}

module.exports = { listar, buscar };
