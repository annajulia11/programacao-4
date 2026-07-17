// ─────────────────────────────────────────────
// Testes — CRUD de Missões + proteção JWT
// ─────────────────────────────────────────────
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/app');

let token;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/registrar')
    .send({ nome: 'Hokage', email: 'hokage@konoha.com', senha: 'sharingan' });
  token = res.body.token;
});

const auth = (req) => req.set('Authorization', `Bearer ${token}`);

describe('Proteção das rotas (Requisito D)', () => {
  test('GET /api/missoes sem token retorna 401', async () => {
    const res = await request(app).get('/api/missoes');
    expect(res.status).toBe(401);
  });

  test('GET /api/missoes com token inválido retorna 401', async () => {
    const res = await request(app)
      .get('/api/missoes')
      .set('Authorization', 'Bearer token-falso');
    expect(res.status).toBe(401);
  });

  test('GET /api/aldeias sem token retorna 401', async () => {
    const res = await request(app).get('/api/aldeias');
    expect(res.status).toBe(401);
  });
});

describe('CRUD de Missões (/api/missoes)', () => {
  let idCriada;

  test('POST cria missão válida (201)', async () => {
    const res = await auth(request(app).post('/api/missoes')).send({
      titulo: 'Resgatar o Kazekage',
      rank: 'S',
      conteudo: 'A Akatsuki sequestrou Gaara...',
      imagem: 'https://exemplo.com/suna.png',
      ordem: 2,
    });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.titulo).toBe('Resgatar o Kazekage');
    expect(res.body.rank).toBe('S');
    idCriada = res.body.id;
  });

  test('POST rejeita missão sem título (400)', async () => {
    const res = await auth(request(app).post('/api/missoes')).send({
      conteudo: 'Sem título...',
    });
    expect(res.status).toBe(400);
  });

  test('POST rejeita missão sem conteúdo (400)', async () => {
    const res = await auth(request(app).post('/api/missoes')).send({
      titulo: 'Só título',
    });
    expect(res.status).toBe(400);
  });

  test('POST rejeita rank inválido (regra de negócio) (400)', async () => {
    const res = await auth(request(app).post('/api/missoes')).send({
      titulo: 'Missão impossível',
      conteudo: 'Rank que não existe...',
      rank: 'Z',
    });
    expect(res.status).toBe(400);
    expect(res.body.erro).toMatch(/Rank inválido/);
  });

  test('POST aceita rank minúsculo e normaliza para maiúsculo', async () => {
    const res = await auth(request(app).post('/api/missoes')).send({
      titulo: 'Patrulhar os portões',
      conteudo: 'Vigiar a entrada da vila.',
      rank: 'c',
      ordem: 9,
    });
    expect(res.status).toBe(201);
    expect(res.body.rank).toBe('C');
  });

  test('POST sem rank usa o padrão D', async () => {
    const res = await auth(request(app).post('/api/missoes')).send({
      titulo: 'Regar as plantas da academia',
      conteudo: 'Tarefa simples.',
      ordem: 10,
    });
    expect(res.status).toBe(201);
    expect(res.body.rank).toBe('D');
  });

  test('GET lista missões ordenadas pelo campo "ordem" (prioridade)', async () => {
    // cria uma missão com prioridade máxima — deve aparecer primeiro
    await auth(request(app).post('/api/missoes')).send({
      titulo: 'Defender a vila',
      conteudo: 'Prioridade máxima!',
      rank: 'S',
      ordem: 1,
    });

    const res = await auth(request(app).get('/api/missoes'));
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const ordens = res.body.map((m) => m.ordem);
    expect(ordens).toEqual([...ordens].sort((a, b) => a - b));
    expect(res.body[0].titulo).toBe('Defender a vila');
  });

  test('GET /:id busca uma missão específica', async () => {
    const res = await auth(request(app).get(`/api/missoes/${idCriada}`));
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(idCriada);
  });

  test('GET /:id inexistente retorna 404', async () => {
    const res = await auth(request(app).get('/api/missoes/99999'));
    expect(res.status).toBe(404);
  });

  test('PUT atualiza uma missão (200)', async () => {
    const res = await auth(request(app).put(`/api/missoes/${idCriada}`)).send({
      titulo: 'Resgatar o Kazekage (concluída)',
      ordem: 10,
    });
    expect(res.status).toBe(200);
    expect(res.body.titulo).toBe('Resgatar o Kazekage (concluída)');
    expect(res.body.ordem).toBe(10);
    // campos não enviados são preservados
    expect(res.body.conteudo).toBe('A Akatsuki sequestrou Gaara...');
    expect(res.body.rank).toBe('S');
  });

  test('PUT com rank inválido retorna 400', async () => {
    const res = await auth(request(app).put(`/api/missoes/${idCriada}`)).send({
      rank: 'X',
    });
    expect(res.status).toBe(400);
  });

  test('PUT em missão inexistente retorna 404', async () => {
    const res = await auth(request(app).put('/api/missoes/99999')).send({
      titulo: 'X',
      conteudo: 'Y',
    });
    expect(res.status).toBe(404);
  });

  test('DELETE remove uma missão (204) e ela some do mural', async () => {
    const res = await auth(request(app).delete(`/api/missoes/${idCriada}`));
    expect(res.status).toBe(204);

    const busca = await auth(request(app).get(`/api/missoes/${idCriada}`));
    expect(busca.status).toBe(404);
  });

  test('DELETE em missão inexistente retorna 404', async () => {
    const res = await auth(request(app).delete('/api/missoes/99999'));
    expect(res.status).toBe(404);
  });
});
