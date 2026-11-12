// ─────────────────────────────────────────────
// Configuração do Express (separada do server.js
// para permitir os testes com supertest)
// ─────────────────────────────────────────────
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const missaoRoutes = require('./routes/missaoRoutes');
const aldeiaRoutes = require('./routes/aldeiaRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Rota de status (pública) — útil para verificar se a API está no ar
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', servico: 'Konoha Wiki API', versao: '1.0.0' });
});

app.use('/api/auth', authRoutes);
app.use('/api/missoes', missaoRoutes);
app.use('/api/aldeias', aldeiaRoutes);

// 404 padrão
app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));

module.exports = app;
