// ─────────────────────────────────────────────
// Testes — Autenticação JWT (registro e login)
// ─────────────────────────────────────────────
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/app');

const USUARIO = { nome: 'Teste', email: 'teste@konoha.com', senha: 'chidori123' };

describe('Autenticação (/api/auth)', () => {
  test('POST /registrar cria um usuário e retorna token', async () => {
    const res = await request(app).post('/api/auth/registrar').send(USUARIO);
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.usuario.email).toBe(USUARIO.email);
    // a senha nunca deve voltar na resposta
    expect(res.body.usuario.senha).toBeUndefined();
  });

  test('POST /registrar rejeita e-mail duplicado (409)', async () => {
    const res = await request(app).post('/api/auth/registrar').send(USUARIO);
    expect(res.status).toBe(409);
  });

  test('POST /registrar valida campos obrigatórios (400)', async () => {
    const res = await request(app).post('/api/auth/registrar').send({ nome: 'X' });
    expect(res.status).toBe(400);
    expect(res.body.erro).toBeDefined();
  });

  test('POST /registrar rejeita senha curta (400)', async () => {
    const res = await request(app)
      .post('/api/auth/registrar')
      .send({ nome: 'X', email: 'x@x.com', senha: '123' });
    expect(res.status).toBe(400);
  });

  test('POST /login com credenciais corretas retorna token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: USUARIO.email, senha: USUARIO.senha });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('POST /login com senha errada retorna 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: USUARIO.email, senha: 'senha-errada' });
    expect(res.status).toBe(401);
  });

  test('GET /eu retorna o usuário do token', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: USUARIO.email, senha: USUARIO.senha });

    const res = await request(app)
      .get('/api/auth/eu')
      .set('Authorization', `Bearer ${login.body.token}`);

    expect(res.status).toBe(200);
    expect(res.body.usuario.email).toBe(USUARIO.email);
  });
});
