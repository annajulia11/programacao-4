const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🍥 Konoha Wiki API rodando em http://localhost:${PORT}`);
  console.log('   Rotas: /api/status · /api/auth · /api/missoes · /api/aldeias');
});
