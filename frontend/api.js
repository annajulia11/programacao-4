/* ═════════════════════════════════════════════════════════
   api.js — Integração do Front-end com o Back-end (Trabalho 2)

   O front não consome mais dados estáticos/mockados:
   - Aldeias           → GET  /api/aldeias
   - Mural de Missões  → GET  /api/missoes (ordenadas por prioridade)
   - Gerenciar         → POST / PUT / DELETE /api/missoes
   - Autenticação      → POST /api/auth/login | /api/auth/registrar (JWT)
   ═════════════════════════════════════════════════════════ */
'use strict';

const API_URL = 'http://localhost:3000/api';

/* ───────────────── Token (JWT) ───────────────── */
function getToken() { return sessionStorage.getItem('konoha_token'); }
function setToken(t) { sessionStorage.setItem('konoha_token', t); }
function setUsuario(u) { sessionStorage.setItem('konoha_usuario', JSON.stringify(u)); }
function getUsuario() {
  try { return JSON.parse(sessionStorage.getItem('konoha_usuario')); }
  catch { return null; }
}
function logout() {
  sessionStorage.removeItem('konoha_token');
  sessionStorage.removeItem('konoha_usuario');
  location.reload();
}

/* ───────────────── Cliente HTTP ───────────────── */
async function api(rota, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${rota}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Token expirado/inválido → volta para o login
  if (res.status === 401 && !rota.startsWith('/auth')) {
    logout();
    return;
  }

  if (res.status === 204) return null;

  const dados = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(dados.erro || `Erro ${res.status}`);
  return dados;
}

/* ───────────────── Segurança básica de renderização ───────────────── */
function esc(texto) {
  const div = document.createElement('div');
  div.textContent = String(texto ?? '');
  return div.innerHTML;
}

/* ───────────────── Aldeias (dinâmicas) ───────────────── */
window.ALDEIAS_CACHE = {}; // usado pelo openAldeia() do script.js

async function carregarAldeias() {
  const grid = document.getElementById('aldeias-grid');
  try {
    const aldeias = await api('/aldeias');
    window.ALDEIAS_CACHE = Object.fromEntries(aldeias.map(a => [a.chave, a]));

    grid.innerHTML = aldeias.map(a => `
      <div class="aldeia-card" onclick="openAldeia('${esc(a.chave)}')">
        <img src="${esc(a.simbolo)}" class="aldeia-img" alt="${esc(a.nome)}" onerror="this.style.display='none'">
        <h3>${esc(a.nome.split(' no ')[0])}</h3>
        <p>${esc((a.sub || '').split(' · ')[0])}</p>
      </div>
    `).join('');
  } catch (e) {
    grid.innerHTML = `<p class="api-erro">Não foi possível carregar as aldeias: ${esc(e.message)}</p>`;
  }
}

/* ───────────────── Mural de Missões (dinâmico) ───────────────── */
const RANK_INFO = {
  D: { cor: '#7f8c8d', label: 'Rank D' },
  C: { cor: '#27ae60', label: 'Rank C' },
  B: { cor: '#2980b9', label: 'Rank B' },
  A: { cor: '#e67e22', label: 'Rank A' },
  S: { cor: '#c0392b', label: 'Rank S' },
};

async function carregarMissoes() {
  const mural = document.getElementById('mural-missoes');
  const lista = document.getElementById('admin-lista');
  try {
    const missoes = await api('/missoes'); // já vem ORDER BY ordem (prioridade)

    mural.innerHTML = missoes.length
      ? missoes.map(m => {
          const rank = RANK_INFO[m.rank] || RANK_INFO.D;
          return `
          <article class="missao-card" style="--rank-cor: ${rank.cor}">
            <div class="missao-topo">
              <span class="missao-rank">${esc(m.rank)}</span>
              <span class="missao-prioridade">Prioridade ${esc(m.ordem)}</span>
            </div>
            <h3>${esc(m.titulo)}</h3>
            <p>${esc(m.conteudo)}</p>
            ${m.imagem ? `<img class="missao-img" src="${esc(m.imagem)}" alt="${esc(m.titulo)}" onerror="this.remove()">` : ''}
          </article>`;
        }).join('')
      : '<p class="api-loading">Nenhuma missão no mural. Publique a primeira na seção Gerenciar!</p>';

    lista.innerHTML = missoes.length
      ? missoes.map(m => `
          <li class="admin-item" data-id="${m.id}">
            <div class="admin-item-info">
              <span class="admin-item-ordem" style="--rank-cor: ${(RANK_INFO[m.rank] || RANK_INFO.D).cor}">${esc(m.rank)}</span>
              <div>
                <strong>${esc(m.titulo)}</strong>
                <small>Prioridade ${esc(m.ordem)}</small>
              </div>
            </div>
            <div class="admin-item-acoes">
              <button type="button" class="btn-mini" data-acao="editar">Editar</button>
              <button type="button" class="btn-mini btn-perigo" data-acao="excluir">Excluir</button>
            </div>
          </li>
        `).join('')
      : '<li class="api-loading">Nenhuma missão publicada.</li>';

    window.MISSOES_CACHE = missoes;
  } catch (e) {
    mural.innerHTML = `<p class="api-erro">Não foi possível carregar o mural: ${esc(e.message)}</p>`;
    lista.innerHTML = `<li class="api-erro">${esc(e.message)}</li>`;
  }
}

/* ───────────────── Painel Gerenciar (CRUD) ───────────────── */
function feedback(msg, erro = false) {
  const el = document.getElementById('admin-feedback');
  el.textContent = msg;
  el.classList.toggle('erro', erro);
  if (msg) setTimeout(() => { el.textContent = ''; }, 4000);
}

function preencherFormulario(m) {
  document.getElementById('missao-id').value = m?.id || '';
  document.getElementById('missao-titulo').value = m?.titulo || '';
  document.getElementById('missao-rank').value = m?.rank || 'D';
  document.getElementById('missao-conteudo').value = m?.conteudo || '';
  document.getElementById('missao-imagem').value = m?.imagem || '';
  document.getElementById('missao-ordem').value = m?.ordem ?? 0;
  document.getElementById('form-missao-titulo').textContent = m ? `Editando: ${m.titulo}` : 'Nova missão';
  document.getElementById('btn-cancelar-edicao').hidden = !m;
}

function initPainelAdmin() {
  const form = document.getElementById('form-missao');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('missao-id').value;
    const body = {
      titulo: document.getElementById('missao-titulo').value.trim(),
      rank: document.getElementById('missao-rank').value,
      conteudo: document.getElementById('missao-conteudo').value.trim(),
      imagem: document.getElementById('missao-imagem').value.trim() || null,
      ordem: Number(document.getElementById('missao-ordem').value) || 0,
    };

    try {
      if (id) {
        await api(`/missoes/${id}`, { method: 'PUT', body });
        feedback('Missão atualizada!');
      } else {
        await api('/missoes', { method: 'POST', body });
        feedback('Missão publicada!');
      }
      preencherFormulario(null);
      await carregarMissoes();
    } catch (err) {
      feedback(err.message, true);
    }
  });

  document.getElementById('btn-cancelar-edicao')
    .addEventListener('click', () => preencherFormulario(null));

  document.getElementById('admin-lista').addEventListener('click', async (e) => {
    const botao = e.target.closest('button[data-acao]');
    if (!botao) return;
    const id = Number(botao.closest('.admin-item').dataset.id);
    const missao = (window.MISSOES_CACHE || []).find(m => m.id === id);

    if (botao.dataset.acao === 'editar') {
      preencherFormulario(missao);
      document.getElementById('gerenciar').scrollIntoView({ behavior: 'smooth' });
    }

    if (botao.dataset.acao === 'excluir') {
      if (!confirm(`Excluir a missão "${missao?.titulo}"?`)) return;
      try {
        await api(`/missoes/${id}`, { method: 'DELETE' });
        feedback('Missão excluída.');
        await carregarMissoes();
      } catch (err) {
        feedback(err.message, true);
      }
    }
  });
}

/* ───────────────── Login / Registro (JWT) ───────────────── */
function initLogin() {
  const overlay = document.getElementById('login-overlay');
  const form = document.getElementById('form-login');
  const msg = document.getElementById('login-feedback');
  let modo = 'login';

  document.querySelectorAll('.login-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      modo = tab.dataset.modo;
      document.getElementById('campo-nome').hidden = modo !== 'registrar';
      document.getElementById('btn-login').textContent = modo === 'login' ? 'Entrar' : 'Criar conta';
      msg.textContent = '';
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';
    const body = {
      email: document.getElementById('login-email').value.trim(),
      senha: document.getElementById('login-senha').value,
    };
    if (modo === 'registrar') body.nome = document.getElementById('login-nome').value.trim();

    try {
      const rota = modo === 'login' ? '/auth/login' : '/auth/registrar';
      const dados = await api(rota, { method: 'POST', body });
      setToken(dados.token);
      setUsuario(dados.usuario);
      overlay.classList.add('escondido');
      await iniciarAppAutenticado();
    } catch (err) {
      msg.textContent = err.message;
    }
  });
}

function mostrarUsuarioNav() {
  const usuario = getUsuario();
  if (!usuario) return;
  document.getElementById('nav-user').hidden = false;
  document.getElementById('nav-user-nome').textContent = `🍃 ${usuario.nome}`;
  document.getElementById('btn-logout').addEventListener('click', logout);
}

/* ───────────────── Inicialização ───────────────── */
async function iniciarAppAutenticado() {
  mostrarUsuarioNav();
  await Promise.all([carregarAldeias(), carregarMissoes()]);
}

document.addEventListener('DOMContentLoaded', async () => {
  initLogin();
  initPainelAdmin();

  const overlay = document.getElementById('login-overlay');

  if (getToken()) {
    try {
      await api('/auth/eu'); // valida o token no servidor
      overlay.classList.add('escondido');
      await iniciarAppAutenticado();
    } catch {
      logout();
    }
  }
  // Sem token: o overlay de login permanece visível.
});
