// ─────────────────────────────────────────────
// Controller de autenticação — registrar e login
// ─────────────────────────────────────────────
const bcrypt = require('bcryptjs');
const db = require('../database/db');
const { gerarToken } = require('../middleware/auth');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/auth/registrar
function registrar(req, res) {
  const { nome, email, senha } = req.body || {};

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Campos obrigatórios: nome, email e senha.' });
  }
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ erro: 'E-mail inválido.' });
  }
  if (String(senha).length < 6) {
    return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres.' });
  }

  const existente = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email);
  if (existente) {
    return res.status(409).json({ erro: 'Já existe um usuário com esse e-mail.' });
  }

  const hash = bcrypt.hashSync(String(senha), 10);
  const info = db
    .prepare('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)')
    .run(nome, email, hash);

  const usuario = { id: info.lastInsertRowid, nome, email };
  return res.status(201).json({ usuario, token: gerarToken(usuario) });
}

// POST /api/auth/login
function login(req, res) {
  const { email, senha } = req.body || {};

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Campos obrigatórios: email e senha.' });
  }

  const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
  if (!usuario || !bcrypt.compareSync(String(senha), usuario.senha)) {
    return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
  }

  const dados = { id: usuario.id, nome: usuario.nome, email: usuario.email };
  return res.json({ usuario: dados, token: gerarToken(dados) });
}

// GET /api/auth/eu  (rota protegida — devolve o usuário do token)
function eu(req, res) {
  return res.json({ usuario: req.usuario });
}

module.exports = { registrar, login, eu };
