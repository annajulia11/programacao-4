// ─────────────────────────────────────────────
// Seed — popula o banco com os dados que antes
// estavam estáticos no front-end (Trabalho 1).
// Executar com:  npm run seed
// ─────────────────────────────────────────────
const bcrypt = require('bcryptjs');
const db = require('./db');

// 1) Usuário padrão -------------------------------------------------------
const ADMIN = { nome: 'Anna Júlia', email: 'admin@konoha.com', senha: 'rasengan123' };

const jaExiste = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(ADMIN.email);
if (!jaExiste) {
  db.prepare('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)').run(
    ADMIN.nome,
    ADMIN.email,
    bcrypt.hashSync(ADMIN.senha, 10)
  );
  console.log(`✔ Usuário criado: ${ADMIN.email} / senha: ${ADMIN.senha}`);
} else {
  console.log('• Usuário admin já existe, pulando.');
}

// 2) Missões (mural da Hokage — a "ordem" é a prioridade no mural) ------
const MISSOES = [
  {
    titulo: 'Resgatar o Kazekage',
    rank: 'S',
    conteudo:
      'A Akatsuki sequestrou Gaara para extrair o Shukaku. A Equipe Kakashi deve partir imediatamente para Sunagakure e interceptar os criminosos antes que a extração seja concluída. Perigo extremo: Sasori e Deidara confirmados no local.',
    imagem: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Sunagakure_Symbol.svg/1280px-Sunagakure_Symbol.svg.png',
    ordem: 1,
  },
  {
    titulo: 'Investigar a fortaleza de Orochimaru',
    rank: 'A',
    conteudo:
      'Infiltrar o esconderijo de Orochimaru para confirmar a localização de Sasuke Uchiha e coletar informações sobre os experimentos com o Selo Amaldiçoado. Missão de espionagem: evitar combate direto a todo custo.',
    imagem: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Simbolo_konoha.svg/500px-Simbolo_konoha.svg.png',
    ordem: 2,
  },
  {
    titulo: 'Escoltar comerciantes até o País das Ondas',
    rank: 'B',
    conteudo:
      'Comboio de comerciantes solicita proteção na rota até o País das Ondas. Relatos de bandidos e possíveis ninjas renegados na estrada. Equipe de três genins acompanhados de um jōnin responsável.',
    imagem: null,
    ordem: 3,
  },
  {
    titulo: 'Entregar pergaminhos ao Monte Myōboku',
    rank: 'C',
    conteudo:
      'Levar pergaminhos selados de Tsunade até os sapos anciões do Monte Myōboku. A rota é segura, mas o conteúdo dos pergaminhos é confidencial. Discrição exigida durante todo o trajeto.',
    imagem: null,
    ordem: 4,
  },
  {
    titulo: 'Capturar Tora, o gato da esposa do Daimyō',
    rank: 'D',
    conteudo:
      'O gato Tora fugiu do palácio novamente. Localizar e devolver o animal em segurança à esposa do Senhor Feudal do País do Fogo. Atenção: o alvo é conhecido por arranhar. Missão recomendada para equipes recém-formadas.',
    imagem: null,
    ordem: 5,
  },
  {
    titulo: 'Ajudar na colheita da fazenda Ichiraku',
    rank: 'D',
    conteudo:
      'A fazenda que fornece ingredientes ao Ichiraku Ramen precisa de ajuda com a colheita antes das chuvas. Trabalho braçal simples. Pagamento inclui uma tigela de ramen por ninja.',
    imagem: null,
    ordem: 6,
  },
];

const temMissoes = db.prepare('SELECT COUNT(*) AS n FROM missoes').get().n;
if (temMissoes === 0) {
  const insere = db.prepare(
    'INSERT INTO missoes (titulo, rank, conteudo, imagem, ordem) VALUES (?, ?, ?, ?, ?)'
  );
  for (const m of MISSOES) insere.run(m.titulo, m.rank, m.conteudo, m.imagem, m.ordem);
  console.log(`✔ ${MISSOES.length} missões inseridas no mural.`);
} else {
  console.log('• Tabela de missões já possui dados, pulando.');
}

// 3) Aldeias (dados que antes estavam no ALDEIAS_DATA do script.js) -------
const ALDEIAS = [
  {
    chave: 'konoha', nome: 'Konohagakure no Satō', kanji: '木ノ葉隠れの里',
    sub: 'Vila Oculta da Folha · País do Fogo', kage: 'Hokage',
    kage_atual: 'Naruto Uzumaki (7º Hokage)', cor: '#27ae60', emoji: '🍃',
    simbolo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Simbolo_konoha.svg/500px-Simbolo_konoha.svg.png',
    fundacao: 'Séc. I da era ninja, por Hashirama Senju e Madara Uchiha',
    descricao: 'A maior e mais influente aldeia ninja do mundo. Sede da maior parte dos eventos da série, Konoha é o lar do Clã Uchiha, do Clã Hyūga, do Clã Nara e de dezenas de famílias ninja históricas. Abriga a Floresta da Morte, o Monte Hokage e a escola ninja de Iruka.',
    especialidades: ['Ninjutsu variado', 'Genjutsu avançado', 'Taijutsu estilo dinâmico', 'Médico-ninja', 'ANBU / Raiz'],
    ninjas: ['Naruto Uzumaki', 'Sasuke Uchiha', 'Kakashi Hatake', 'Itachi Uchiha', 'Tsunade', 'Jiraiya', 'Minato Namikaze'],
    ordem: 1,
  },
  {
    chave: 'suna', nome: 'Sunagakure no Satō', kanji: '砂隠れの里',
    sub: 'Vila Oculta da Areia · País do Vento', kage: 'Kazekage',
    kage_atual: 'Gaara (5º Kazekage)', cor: '#e67e22', emoji: '🏜️',
    simbolo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Sunagakure_Symbol.svg/1280px-Sunagakure_Symbol.svg.png',
    fundacao: 'Fundada pelo Primeiro Kazekage, filho do Sábio dos Seis Caminhos',
    descricao: 'Localizada no coração do deserto do País do Vento, Sunagakure é especialista em técnicas de areia e marionetes. Aliada histórica de Konoha, foi palco do resgate de Gaara no arco de abertura de Shippuden e enviou reforços decisivos na Quarta Grande Guerra Ninja.',
    especialidades: ['Jutsu de Areia', 'Técnicas de Marionetes', 'Envenenamento', 'Fuinjutsu de lacre', 'Exploração de deserto'],
    ninjas: ['Gaara', 'Temari', 'Kankurō', 'Chiyo', 'Sasori (ex)', 'Baki'],
    ordem: 2,
  },
  {
    chave: 'kiri', nome: 'Kirigakure no Satō', kanji: '霧隠れの里',
    sub: 'Vila Oculta da Névoa · País da Água', kage: 'Mizukage',
    kage_atual: 'Mei Terumī (5ª Mizukage)', cor: '#2980b9', emoji: '🌊',
    simbolo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Kirigakure_Symbol.svg/3840px-Kirigakure_Symbol.svg.png',
    fundacao: 'Fundada no arquipélago do País da Água, era historicamente conhecida pela brutalidade',
    descricao: 'Conhecida como a "Vila do Massacre" por suas práticas de eliminar novatos no exame de graduação. Sob o controle oculto de Obito como "Yagura", viveu um período sombrio. Mei Terumī encerrou essa era e modernizou a aldeia. Lar dos Sete Espadachins da Névoa, elite guerreira lendária.',
    especialidades: ['Suiton (Liberação de Água)', 'Névoa Assassina', 'Kenjutsu com espadas únicas', 'Kekkei Genkai raros', 'Infiltração'],
    ninjas: ['Mei Terumī', 'Kisame Hoshigaki', 'Zabuza Momochi', 'Haku', 'Yagura (4º Mizukage)', 'Suigetsu Hōzuki'],
    ordem: 3,
  },
  {
    chave: 'kumo', nome: 'Kumogakure no Satō', kanji: '雲隠れの里',
    sub: 'Vila Oculta da Nuvem · País do Relâmpago', kage: 'Raikage',
    kage_atual: 'A — Quarto Raikage', cor: '#8e44ad', emoji: '⛈️',
    simbolo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Kumogakure_Pays_de_la_Foudre.svg/1280px-Kumogakure_Pays_de_la_Foudre.svg.png',
    fundacao: 'Erguida nos picos das montanhas do País do Relâmpago, acima das nuvens',
    descricao: 'Segunda maior potência ninja do mundo, rival histórica de Konoha e Iwa. Seus ninjas são conhecidos pela força física sobre-humana potencializada pelo chakra de relâmpago. Lar de Killer Bee e do Raikage, assumiu papel central na liderança das forças aliadas na Quarta Grande Guerra.',
    especialidades: ['Raiton (Liberação de Relâmpago)', 'Revestimento de Chakra', 'Força e velocidade extremas', 'Controle de Bijuu', 'Guerreiros físicos de elite'],
    ninjas: ['A (4º Raikage)', 'Killer Bee', 'Darui', 'C', 'Gyūki (Bijuu)', 'Yugito Nii'],
    ordem: 4,
  },
  {
    chave: 'iwa', nome: 'Iwagakure no Satō', kanji: '岩隠れの里',
    sub: 'Vila Oculta da Pedra · País da Terra', kage: 'Tsuchikage',
    kage_atual: 'Ōnoki (3º Tsuchikage)', cor: '#7f8c8d', emoji: '🪨',
    simbolo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Iwagakure.svg',
    fundacao: 'Fundada nas montanhas rochosas centrais do País da Terra, isolada e impenetrável',
    descricao: 'Potência isolacionista com longa história de conflito com Konoha. Ōnoki, o mais velho dos Kage, viveu para ver Madara Uchiha e batalhou contra ele. O Elemento de Pó — técnica exclusiva de Ōnoki — é uma das habilidades mais temidas da história ninja, capaz de desintegrar qualquer matéria.',
    especialidades: ['Doton (Liberação de Terra)', 'Elemento de Pó (Kekkei Tōta)', 'Defesa de terreno', 'Explosivos de argila', 'Resistência extrema'],
    ninjas: ['Ōnoki (3º Tsuchikage)', 'Deidara (ex)', 'Kitsuchi', 'Kurotsuchi', 'Han (Jinchūriki)'],
    ordem: 5,
  },
];

const temAldeias = db.prepare('SELECT COUNT(*) AS n FROM aldeias').get().n;
if (temAldeias === 0) {
  const insere = db.prepare(`
    INSERT INTO aldeias
      (chave, nome, kanji, sub, kage, kage_atual, cor, emoji, simbolo, fundacao, descricao, especialidades, ninjas, ordem)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const a of ALDEIAS) {
    insere.run(
      a.chave, a.nome, a.kanji, a.sub, a.kage, a.kage_atual, a.cor, a.emoji,
      a.simbolo, a.fundacao, a.descricao,
      JSON.stringify(a.especialidades), JSON.stringify(a.ninjas), a.ordem
    );
  }
  console.log(`✔ ${ALDEIAS.length} aldeias inseridas.`);
} else {
  console.log('• Tabela de aldeias já possui dados, pulando.');
}

console.log('🍥 Seed concluído!');
