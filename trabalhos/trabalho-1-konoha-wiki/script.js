
'use strict';


function showChar(id, clickedTab) {
  document.querySelectorAll('.char-panel').forEach(p => {
    p.classList.remove('active');
  });
  document.querySelectorAll('.char-tab').forEach(t => t.classList.remove('active'));

  const panel = document.getElementById('char-' + id);
  if (panel) {
    panel.classList.add('active');
  }

  if (clickedTab) clickedTab.classList.add('active');
}


/*2. ALDEIAS — MODAL */
const ALDEIAS_DATA = {
  konoha: {
    nome:    'Konohagakure no Satō',
    kanji:   '木ノ葉隠れの里',
    sub:     'Vila Oculta da Folha · País do Fogo',
    kage:    'Hokage',
    kageAtual: 'Naruto Uzumaki (7º Hokage)',
    cor:     '#27ae60',
    emoji:   '🍃',
    simbolo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Simbolo_konoha.svg/500px-Simbolo_konoha.svg.png',
    fundacao: 'Séc. I da era ninja, por Hashirama Senju e Madara Uchiha',
    descricao: 'A maior e mais influente aldeia ninja do mundo. Sede da maior parte dos eventos da série, Konoha é o lar do Clã Uchiha, do Clã Hyūga, do Clã Nara e de dezenas de famílias ninja históricas. Abriga a Floresta da Morte, o Monte Hokage e a escola ninja de Iruka.',
    especialidades: ['Ninjutsu variado', 'Genjutsu avançado', 'Taijutsu estilo dinâmico', 'Médico-ninja', 'ANBU / Raiz'],
    ninjas: ['Naruto Uzumaki', 'Sasuke Uchiha', 'Kakashi Hatake', 'Itachi Uchiha', 'Tsunade', 'Jiraiya', 'Minato Namikaze'],
  },
  suna: {
    nome:    'Sunagakure no Satō',
    kanji:   '砂隠れの里',
    sub:     'Vila Oculta da Areia · País do Vento',
    kage:    'Kazekage',
    kageAtual: 'Gaara (5º Kazekage)',
    cor:     '#e67e22',
    emoji:   '🏜️',
    simbolo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Sunagakure_Symbol.svg/1280px-Sunagakure_Symbol.svg.png',
    fundacao: 'Fundada pelo Primeiro Kazekage, filho do Sábio dos Seis Caminhos',
    descricao: 'Localizada no coração do deserto do País do Vento, Sunagakure é especialista em técnicas de areia e marionetes. Aliada histórica de Konoha, foi palco do resgate de Gaara no arco de abertura de Shippuden e enviou reforços decisivos na Quarta Grande Guerra Ninja.',
    especialidades: ['Jutsu de Areia', 'Técnicas de Marionetes', 'Envenenamento', 'Fuinjutsu de lacre', 'Exploração de deserto'],
    ninjas: ['Gaara', 'Temari', 'Kankurō', 'Chiyo', 'Sasori (ex)', 'Baki'],
  },
  kiri: {
    nome:    'Kirigakure no Satō',
    kanji:   '霧隠れの里',
    sub:     'Vila Oculta da Névoa · País da Água',
    kage:    'Mizukage',
    kageAtual: 'Mei Terumī (5ª Mizukage)',
    cor:     '#2980b9',
    emoji:   '🌊',
    simbolo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Kirigakure_Symbol.svg/3840px-Kirigakure_Symbol.svg.png',
    fundacao: 'Fundada no arquipélago do País da Água, era historicamente conhecida pela brutalidade',
    descricao: 'Conhecida como a "Vila do Massacre" por suas práticas de eliminar novatos no exame de graduação. Sob o controle oculto de Obito como "Yagura", viveu um período sombrio. Mei Terumī encerrou essa era e modernizou a aldeia. Lar dos Sete Espadachins da Névoa, elite guerreira lendária.',
    especialidades: ['Suiton (Liberação de Água)', 'Névoa Assassina', 'Kenjutsu com espadas únicas', 'Kekkei Genkai raros', 'Infiltração'],
    ninjas: ['Mei Terumī', 'Kisame Hoshigaki', 'Zabuza Momochi', 'Haku', 'Yagura (4º Mizukage)', 'Suigetsu Hōzuki'],
  },
  kumo: {
    nome:    'Kumogakure no Satō',
    kanji:   '雲隠れの里',
    sub:     'Vila Oculta da Nuvem · País do Relâmpago',
    kage:    'Raikage',
    kageAtual: 'A — Quarto Raikage',
    cor:     '#8e44ad',
    emoji:   '⛈️',
    simbolo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Kumogakure_Pays_de_la_Foudre.svg/1280px-Kumogakure_Pays_de_la_Foudre.svg.png',
    fundacao: 'Erguida nos picos das montanhas do País do Relâmpago, acima das nuvens',
    descricao: 'Segunda maior potência ninja do mundo, rival histórica de Konoha e Iwa. Seus ninjas são conhecidos pela força física sobre-humana potencializada pelo chakra de relâmpago. Lar de Killer Bee e do Raikage, assumiu papel central na liderança das forças aliadas na Quarta Grande Guerra.',
    especialidades: ['Raiton (Liberação de Relâmpago)', 'Revestimento de Chakra', 'Força e velocidade extremas', 'Controle de Bijuu', 'Guerreiros físicos de elite'],
    ninjas: ['A (4º Raikage)', 'Killer Bee', 'Darui', 'C', 'Gyūki (Bijuu)', 'Yugito Nii'],
  },
  iwa: {
    nome:    'Iwagakure no Satō',
    kanji:   '岩隠れの里',
    sub:     'Vila Oculta da Pedra · País da Terra',
    kage:    'Tsuchikage',
    kageAtual: 'Ōnoki (3º Tsuchikage)',
    cor:     '#7f8c8d',
    emoji:   '🪨',
    simbolo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Iwagakure.svg',
    fundacao: 'Fundada nas montanhas rochosas centrais do País da Terra, isolada e impenetrável',
    descricao: 'Potência isolacionista com longa história de conflito com Konoha. Ōnoki, o mais velho dos Kage, viveu para ver Madara Uchiha e batalhou contra ele. O Elemento de Pó — técnica exclusiva de Ōnoki — é uma das habilidades mais temidas da história ninja, capaz de desintegrar qualquer matéria.',
    especialidades: ['Doton (Liberação de Terra)', 'Elemento de Pó (Kekkei Tōta)', 'Defesa de terreno', 'Explosivos de argila', 'Resistência extrema'],
    ninjas: ['Ōnoki (3º Tsuchikage)', 'Deidara (ex)', 'Kitsuchi', 'Kurotsuchi', 'Han (Jinchūriki)'],
  },
};

function openAldeia(id) {
  const data = ALDEIAS_DATA[id];
  if (!data) return;

  const old = document.getElementById('aldeia-modal');
  if (old) old.remove();

  const modal = document.createElement('div');
  modal.id = 'aldeia-modal';
  modal.innerHTML = `
    <div class="modal-backdrop" onclick="closeModal('aldeia-modal')"></div>
    <div class="modal-box" role="dialog" aria-modal="true">
      <button class="modal-close" onclick="closeModal('aldeia-modal')" aria-label="Fechar">✕</button>

      <div class="modal-header" style="--aldeia-cor: ${data.cor}">
        <div class="modal-header-glow"></div>
        <img src="${data.simbolo}" class="modal-aldeia-logo" alt="${data.nome}" onerror="this.style.display='none'">
        <div>
          <p class="modal-kanji">${data.kanji}</p>
          <h2 class="modal-title">${data.nome}</h2>
          <p class="modal-sub">${data.sub}</p>
        </div>
      </div>

      <div class="modal-body">
        <div class="modal-grid">
          <div class="modal-info-block">
            <span class="modal-label">Liderança</span>
            <span class="modal-value">${data.emoji} ${data.kage} — ${data.kageAtual}</span>
          </div>
          <div class="modal-info-block">
            <span class="modal-label">Fundação</span>
            <span class="modal-value">${data.fundacao}</span>
          </div>
        </div>

        <p class="modal-desc">${data.descricao}</p>

        <div class="modal-section">
          <p class="modal-label">Especialidades de Combate</p>
          <div class="modal-tags">
            ${data.especialidades.map(e => `<span class="modal-tag">${e}</span>`).join('')}
          </div>
        </div>

        <div class="modal-section">
          <p class="modal-label">Ninjas Notáveis</p>
          <div class="modal-ninjas">
            ${data.ninjas.map(n => `<span class="modal-ninja">${n}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  if (!document.getElementById('modal-styles')) injectModalStyles();

  requestAnimationFrame(() => modal.classList.add('visible'));

  document._modalEscHandler = (e) => { if (e.key === 'Escape') closeModal('aldeia-modal'); };
  document.addEventListener('keydown', document._modalEscHandler);
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('visible');
  modal.addEventListener('transitionend', () => modal.remove(), { once: true });
  document.removeEventListener('keydown', document._modalEscHandler);
}

function injectModalStyles() {
  const style = document.createElement('style');
  style.id = 'modal-styles';
  style.textContent = `
    #aldeia-modal {
      position: fixed; inset: 0; z-index: 999;
      display: flex; align-items: center; justify-content: center;
      padding: 1.5rem;
      opacity: 0; transition: opacity .3s;
    }
    #aldeia-modal.visible { opacity: 1; }
    .modal-backdrop {
      position: absolute; inset: 0;
      background: #00000099;
      backdrop-filter: blur(6px);
    }
    .modal-box {
      position: relative;
      background: #272727ff;
      border: 1px solid #2c2c2dff;
      border-radius: 16px;
      width: 100%; max-width: 680px;
      max-height: 90vh; overflow-y: auto;
      box-shadow: 0 30px 100px #000000fd;
      transform: translateY(20px) scale(.97);
      transition: transform .35s cubic-bezier(.25,.8,.25,1);
    }
    #aldeia-modal.visible .modal-box {
      transform: translateY(0) scale(1);
    }
    .modal-close {
      position: absolute; top: 1rem; right: 1.2rem;
      background: none; border: none; cursor: none;
      color: #545456ff; font-size: 1.1rem;
      width: 32px; height: 32px;
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      transition: all .2s; z-index: 2;
    }
    .modal-close:hover { background: #ffffff11; color: #fff; }
    .modal-header {
      padding: 2.5rem 2rem 2rem;
      background: linear-gradient(135deg, color-mix(in srgb, var(--aldeia-cor) 12%, transparent) 0%, transparent 60%);
      border-bottom: 1px solid #29292bff;
      display: flex; align-items: center; gap: 1.5rem;
      position: relative; overflow: hidden;
    }
    .modal-header-glow {
      position: absolute; top: -30px; left: -30px;
      width: 180px; height: 180px;
      background: radial-gradient(circle, color-mix(in srgb, var(--aldeia-cor) 30%, transparent) 0%, transparent 70%);
      pointer-events: none;
    }
    .modal-aldeia-logo {
      width: 80px; height: 80px; object-fit: contain;
      filter: brightness(0) invert(1) opacity(.8);
      flex-shrink: 0; position: relative;
    }
    .modal-kanji {
      font-family: 'Noto Serif JP', serif;
      font-size: .85rem; color: #7a7a9a;
      letter-spacing: .15em; margin-bottom: .3rem;
    }
    .modal-title {
      font-family: 'Cinzel Decorative', serif;
      font-size: 1.3rem; color: #f0e6d0;
      letter-spacing: .04em; line-height: 1.3;
      margin-bottom: .4rem;
    }
    .modal-sub {
      font-family: 'Share Tech Mono', monospace;
      font-size: .75rem; color: var(--aldeia-cor);
      letter-spacing: .12em; text-transform: uppercase;
    }
    .modal-body { padding: 1.8rem 2rem 2.2rem; }
    .modal-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .modal-info-block {
      background: #ffffff05; border: 1px solid #494a51ff;
      border-radius: 8px; padding: .9rem 1rem;
    }
    .modal-label {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: .65rem; letter-spacing: .2em; text-transform: uppercase;
      color: #7a7a9a; margin-bottom: .35rem;
    }
    .modal-value {
      font-family: 'Cinzel', serif;
      font-size: .82rem; color: #ddd5c8; line-height: 1.5;
    }
    .modal-desc {
      color: #b0a898; line-height: 1.85;
      font-family: 'Noto Serif JP', serif;
      font-size: .93rem; margin-bottom: 1.5rem;
    }
    .modal-section { margin-top: 1.4rem; }
    .modal-tags, .modal-ninjas {
      display: flex; flex-wrap: wrap; gap: .45rem; margin-top: .6rem;
    }
    .modal-tag {
      font-family: 'Share Tech Mono', monospace;
      font-size: .7rem; letter-spacing: .1em;
      padding: .3rem .75rem; border-radius: 4px;
      background: color-mix(in srgb, var(--aldeia-cor) 15%, transparent);
      color: var(--aldeia-cor);
      border: 1px solid color-mix(in srgb, var(--aldeia-cor) 40%, transparent);
    }
    .modal-ninja {
      font-family: 'Cinzel', serif; font-size: .75rem;
      padding: .3rem .75rem; border-radius: 4px;
      background: #ffffff06; border: 1px solid #2a2f4a;
      color: #ddd5c8;
    }
    @media (max-width: 520px) {
      .modal-header { flex-direction: column; text-align: center; }
      .modal-grid { grid-template-columns: 1fr; }
      .modal-body { padding: 1.4rem 1.2rem 1.8rem; }
    }
  `;
  document.head.appendChild(style);
}


/* 3. GERADOR DE JUTSU ALEATÓRIO*/
var jutsus = [
  { name: '🌀 Rasengan',                    desc: 'A técnica pessoal do Quarto Hokage, aperfeiçoada por Naruto.' },
  { name: '⚡ Chidori',                     desc: 'Mil relâmpagos condensados — jutsu de Kakashi e Sasuke.' },
  { name: '🔥 Grande Bola de Fogo',         desc: 'O ritual de passagem do Clã Uchiha. Katon supremo.' },
  { name: '🌊 Prisão de Água',              desc: "Aprisiona o alvo dentro de uma esfera d'água sem saída." },
  { name: '🌿 Clones de Sombra',            desc: 'Naruto cria dezenas de clones perfeitamente reais.' },
  { name: '💀 Edo Tensei',                  desc: 'Ressurreição proibida — traz os mortos de volta à vida.' },
  { name: '🌙 Tsukuyomi',                   desc: 'Genjutsu supremo de Itachi. 72 horas de tormento em segundos.' },
  { name: '🔴 Amaterasu',                   desc: 'Chamas negras eternas criadas pelo Mangekyō Sharingan.' },
  { name: '🛡️ Susanoo',                    desc: 'Armadura titânica de chakra — exclusiva dos Uchiha avançados.' },
  { name: '🌪️ Rasenshuriken',              desc: 'A técnica proibida de Naruto — destrói células com vento.' },
  { name: '🦊 Modo Biju',                   desc: 'Naruto acessa o poder total de Kurama em harmonia total.' },
  { name: '🐸 Modo Sábio',                  desc: 'Absorção de energia natural — amplifica todos os atributos.' },
  { name: '💣 Arte Explosiva: Argila',      desc: 'Deidara infunde chakra em argila e cria explosivos vivos.' },
  { name: '⚖️ Rei do Inferno',             desc: 'Pain invoca o guardião do submundo para sugar as almas.' },
  { name: '🌸 Criação',                     desc: 'Sakura acumula chakra para liberar força devastadora.' },
  { name: '✈️ Hirashin',                   desc: 'Minato se teletransporta instantaneamente para qualquer marca selada.' },
  { name: '💥 Shinra Tensei',              desc: 'Pain repele tudo ao redor com força gravitacional — destruiu Konoha inteira.' },
  { name: '🪐 Chibaku Tensei',             desc: 'Uma esfera negra sobe aos céus e forma um satélite de pedra ao redor do alvo.' },
  { name: '🌲 Liberação de Madeira',       desc: 'Hashirama faz florestas inteiras brotarem do nada — único a domar Bijuus.' },
  { name: '👁️ Izanagi',                   desc: 'Reescreve a realidade por instantes, transformando a morte em ilusão.' },
  { name: '👁️ Izanami',                   desc: 'Prende o alvo em um loop infinito de sensações até aceitar seu destino.' },
  { name: '💨 Elemento de Pó',             desc: 'Ōnoki desintegra qualquer matéria em nível molecular com o Kekkei Tōta.' },
  { name: '🌋 Liberação de Lava',          desc: 'Combinação de fogo e terra — Mei dissolve qualquer coisa com vapor ácido.' },
  { name: '🤚 64 Palmas',                  desc: 'Neji fecha progressivamente todos os pontos de chakra do alvo com precisão absoluta.' },
  { name: '🌀 Kamui',                      desc: 'Obito torna o corpo intangível ou suga qualquer alvo para sua dimensão.' },
  { name: '⛈️ Kirin',                     desc: 'Sasuke molda nuvens reais de tempestade e invoca um raio em forma de dragão.' },
  { name: '💪 Oito Portões — Portão da Morte', desc: 'Guy transcende os limites humanos. Poder para derrotar Madara — ao custo da própria vida.' },
  { name: '🎭 Marionete Humana',           desc: 'Sasori transformou seu próprio corpo em marionete para alcançar a arte eterna.' },
  { name: '📄 Jutsu de Tinta',             desc: 'Sai dá vida a criaturas desenhadas com tinta de chakra.' },
  { name: '🐍 Invocação de Serpentes',     desc: 'Orochimaru convoca Manda, a serpente lendária de tamanho colossal.' },
  { name: '🐸 Invocação de Sapos',         desc: 'Naruto e Jiraiya convocam os grandes sapos de Monte Myōboku.' },
  { name: '🦅 Invocação de Aves',          desc: 'Sasuke invoca falcões gigantes para combate aéreo e reconhecimento.' },
  { name: '🌊 Dança das Sete Espadas',     desc: 'Técnica dos Sete Espadachins da Névoa — cada espada tem um poder único.' },
  { name: '🔗 Ligação de Sombras',         desc: 'Shikamaru imobiliza qualquer inimigo prendendo sua sombra à dele.' },
  { name: '💉 Jutsu Médico',               desc: 'Sakura e Tsunade curam ferimentos críticos canalizando chakra nos tecidos.' },
  { name: '🌀 Rotação de Oito Trigramas',  desc: 'Neji gira o corpo expelindo chakra em 360° — defesa impenetrável.' },
  { name: '🎯 Chidori Lança',              desc: 'Sasuke estende o Chidori em uma lança de relâmpago de longo alcance.' },
  { name: '🌪️ Vento: Pressão Aérea',     desc: 'Temari abre seu leque e gera vendavais que cortam como lâminas.' },
  { name: '🏔️ Técnica de Golem de Pedra', desc: 'Gaara molda areia comprimida formando um golem de defesa absolutamente sólido.' },
  { name: '🌙 Lua Cheia: Areia Absoluta',  desc: 'Gaara envolve o alvo em uma esfera de areia e a comprime completamente.' },
  { name: '🌊 Grande Corrente de Água',    desc: 'Kisame cria um oceano de chakra aquático que drena o chakra de todos dentro.' },
  { name: '🔮 Gedō Rinne Tensei',          desc: 'Pain sacrifica sua própria vida para ressuscitar todos os mortos de Konoha.' },
  { name: '👤 Invocação dos Seis Caminhos', desc: 'Nagato controla seis corpos como marionetes usando o Rinnegan.' },
  { name: '🧬 Modificação Corporal',       desc: 'Kabuto absorveu o DNA de vários ninjas para se tornar uma quimera humana.' },
  { name: '🌑 Absorção de Chakra',         desc: 'A Samehada de Kisame devora o chakra do adversário enquanto luta.' },
  { name: '🕊️ Jutsu de Origami',          desc: 'Konan transforma seu corpo e o ambiente em bilhões de bombas de papel.' },
  { name: '🌀 Modo Bijuu Completo',        desc: 'O Jinchūriki assume a forma colossal do Bijuu selado dentro de si.' },
  { name: '⚡ Armadura de Relâmpago',      desc: 'O Raikage envolve o corpo com chakra de relâmpago, atingindo velocidade invisível.' },
  { name: '🌿 Clones de Areia',            desc: 'Gaara cria cópias de areia que explodem ao ser destruídas.' },
  { name: '🔥 Fogo Eterno — Amaterasu',    desc: 'Sasuke molda as chamas negras do Amaterasu em armaduras e projéteis.' },
  { name: '🪶 Arte: Bomba C3',             desc: 'Deidara cria sua maior escultura explosiva — capaz de destruir uma aldeia.' },
];

function randomJutsu() {
  var el   = document.getElementById('jutsu-result');
  var pick = jutsus[Math.floor(Math.random() * jutsus.length)];
  el.classList.remove('flash');
  el.innerHTML = '<span>⏳ Canalizando chakra...</span>';

  setTimeout(function() {
    el.innerHTML =
      '<div style="text-align:center">' +
        '<div style="font-size:1.15rem;margin-bottom:.35rem;">' + pick.name + '</div>' +
        '<div style="font-family:var(--f-ui);font-size:.75rem;color:var(--muted);">' + pick.desc + '</div>' +
      '</div>';
    el.classList.add('flash');
  }, 700);
}


/* 4. NAVEGAÇÃO ATIVA NO SCROLL */
function initNavScroll() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => obs.observe(s));
}


/* 5. ANIMAÇÕES DE SCROLL (Intersection Observer)*/
function initScrollAnimations() {
  const s = document.createElement('style');
  s.textContent = `
    .reveal {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity .55s ease, transform .55s ease;
    }
    .reveal.in-view {
      opacity: 1;
      transform: translateY(0);
    }
    .reveal-left {
      opacity: 0;
      transform: translateX(-30px);
      transition: opacity .55s ease, transform .55s ease;
    }
    .reveal-left.in-view {
      opacity: 1;
      transform: translateX(0);
    }
    .reveal-scale {
      opacity: 0;
      transform: scale(.93);
      transition: opacity .5s ease, transform .5s ease;
    }
    .reveal-scale.in-view {
      opacity: 1;
      transform: scale(1);
    }
  `;
  document.head.appendChild(s);

  document.querySelectorAll('.aldeia-card').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.07}s`;
  });
  document.querySelectorAll('.info-card').forEach(el => el.classList.add('reveal-scale'));
  document.querySelectorAll('.intro-grid .intro-descricao').forEach(el => el.classList.add('reveal-left'));
  document.querySelectorAll('.ficha-img').forEach(el => el.classList.add('reveal'));

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => obs.observe(el));
}


/*6. RASTRO AZUL — LINHAS QUE SEGUEM O CURSOR*/
function initCursorTrail() {
  if (window.matchMedia('(hover: none)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none; z-index: 99998;
  `;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const TRAIL_LENGTH = 28;
  const trail = [];
  let mouseX = -999, mouseY = -999;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function loop() {
    trail.unshift({ x: mouseX, y: mouseY });
    if (trail.length > TRAIL_LENGTH) trail.pop();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (trail.length < 2) {
      requestAnimationFrame(loop);
      return;
    }

    for (let i = 1; i < trail.length; i++) {
      const progress = 1 - i / trail.length;
      const alpha    = progress * 0.75;
      const width    = progress * 3.5 + 0.5;
      const r = Math.round(79  + (1 - progress) * 10);
      const g = Math.round(195 + (1 - progress) * 10);
      const b = 247;

      ctx.beginPath();
      ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
      ctx.lineTo(trail[i].x,     trail[i].y);
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.lineWidth   = width;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
      ctx.stroke();
    }

    if (trail.length > 0) {
      ctx.beginPath();
      ctx.arc(trail[0].x, trail[0].y, 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(79, 195, 247, 0.35)';
      ctx.fill();
    }

    requestAnimationFrame(loop);
  }
  loop();
}


/* 7. CURSOR — RASENGAN PERSONALIZADO*/
function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;

  const globalStyle = document.createElement('style');
  globalStyle.textContent = `*, *::before, *::after { cursor: none !important; }`;
  document.head.appendChild(globalStyle);

  const cursor = document.createElement('div');
  cursor.id = 'ninja-cursor';
  cursor.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 99999;
    width: 30px; height: 30px;
    top: 0; left: 0;
    transform: translate(-50%, -50%);
    will-change: left, top;
    transition: filter .15s, transform .1s;
    border-radius: 50%;
    background: radial-gradient(circle at 38% 35%,
      #ffffff 0%, #a8d8ff 12%, #4fc3f7 28%, #0288d1 50%, #01579b 70%, #012f5a 100%);
    box-shadow:
      0 0 10px 3px #4fc3f7aa,
      0 0 22px 6px #0288d177,
      inset 0 0 8px 2px #ffffffaa;
  `;

  const rCanvas = document.createElement('canvas');
  rCanvas.width = 30; rCanvas.height = 30;
  rCanvas.style.cssText = 'position:absolute;top:0;left:0;border-radius:50%;pointer-events:none;';
  cursor.appendChild(rCanvas);
  const rCtx = rCanvas.getContext('2d');
  let rAngle = 0;
  (function drawRasengan() {
    rCtx.clearRect(0, 0, 30, 30);
    rCtx.save();
    rCtx.translate(15, 15);
    rCtx.rotate(rAngle);
    rCtx.strokeStyle = 'rgba(255,255,255,0.6)';
    rCtx.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) {
      rCtx.beginPath();
      rCtx.ellipse(0, 0, 12, 5, (Math.PI / 3) * i, 0, Math.PI * 2);
      rCtx.stroke();
    }
    rCtx.restore();
    rAngle += 0.09;
    requestAnimationFrame(drawRasengan);
  })();
  document.body.appendChild(cursor);

  const clickDot = document.createElement('div');
  clickDot.id = 'click-dot';
  clickDot.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 99998;
    width: 12px; height: 12px;
    border-radius: 50%;
    background: #4fc3f7;
    box-shadow: 0 0 8px #4fc3f7, 0 0 18px #4fc3f799;
    transform: translate(-50%, -50%) scale(0);
    transition: transform .12s ease, opacity .4s ease;
    opacity: 0;
    top: 0; left: 0;
  `;
  document.body.appendChild(clickDot);

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });

  document.addEventListener('mousedown', e => {
    cursor.style.filter = 'drop-shadow(0 0 10px #4fc3f7) brightness(1.5)';
    cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    clickDot.style.left = e.clientX + 'px';
    clickDot.style.top  = e.clientY + 'px';
    clickDot.style.transform = 'translate(-50%, -50%) scale(1)';
    clickDot.style.opacity = '1';
  });

  document.addEventListener('mouseup', () => {
    cursor.style.filter = 'none';
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    clickDot.style.transform = 'translate(-50%, -50%) scale(2.8)';
    clickDot.style.opacity = '0';
  });

  const INTERACTIVE = 'a, button, .aldeia-card, .char-tab';
  function addHover(el) {
    el.addEventListener('mouseenter', () => {
      cursor.style.filter = 'drop-shadow(0 0 9px #ff6b1a) brightness(1.25)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.filter = 'none';
    });
  }
  document.querySelectorAll(INTERACTIVE).forEach(addHover);

  const mo = new MutationObserver(() => {
    document.querySelectorAll(INTERACTIVE).forEach(el => {
      if (!el.dataset.cursorBound) {
        el.dataset.cursorBound = '1';
        addHover(el);
      }
    });
  });
  mo.observe(document.body, { childList: true, subtree: true });
}


/* ─────────────────────────────────────────────────
   8. INICIALIZAÇÃO
───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const firstPanel = document.querySelector('.char-panel');
  if (firstPanel) {
    firstPanel.classList.add('active');
  }

  initNavScroll();
  initScrollAnimations();
  initCursorTrail();
  initCursor();

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 75;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
});