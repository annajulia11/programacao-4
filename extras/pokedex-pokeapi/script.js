const pokedex = document.getElementById('pokedex');
let listaPokemons = [];

async function carregarPokemons() {
    listaPokemons = [];
    pokedex.innerHTML = '<p style="text-align:center;color:#555;padding:40px 0;">Carregando...</p>';

    const promises = [];
    for (let i = 1; i <= 50; i++) {
        promises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then(r => r.json()));
    }

    listaPokemons = await Promise.all(promises);
    renderizar(listaPokemons);
}

function renderizar(lista) {
    pokedex.innerHTML = '';

    if (lista.length === 0) {
        pokedex.innerHTML = '<p style="text-align:center;color:#555;padding:40px 0;">Nenhum Pokémon encontrado.</p>';
        return;
    }

    lista.forEach(p => {
        const tiposPrimario = p.types[0]?.type.name || 'normal';
        const badges = p.types.map(t =>
            `<span class="tipo-badge tipo-${t.type.name}">${t.type.name}</span>`
        ).join('');

        const card = document.createElement('div');
        card.classList.add('card', `border-${tiposPrimario}`);

        card.innerHTML = `
            <div class="card-img-area">
                <img src="${p.sprites.other?.['official-artwork']?.front_default || p.sprites.front_default}" alt="${p.name}">
            </div>
            <span class="card-numero">#${String(p.id).padStart(3,'0')}</span>
            <h3>${p.name}</h3>
            <div class="tipo-badges">${badges}</div>
        `;

        card.addEventListener('click', () => abrirModal(p));
        pokedex.appendChild(card);
    });
}

function abrirModal(p) {
    const artwork = p.sprites.other?.['official-artwork']?.front_default || p.sprites.front_default;
    document.getElementById('modal-img').src = artwork;
    document.getElementById('modal-img').alt = p.name;
    document.getElementById('modal-nome').textContent = p.name;
    document.getElementById('modal-tipos').style.display = 'none';

    // badges de tipo no modal
    let badgesEl = document.getElementById('modal-tipo-badges');
    if (!badgesEl) {
        badgesEl = document.createElement('div');
        badgesEl.id = 'modal-tipo-badges';
        document.getElementById('modal-nome').after(badgesEl);
    }
    badgesEl.innerHTML = p.types.map(t =>
        `<span class="tipo-badge tipo-${t.type.name}">${t.type.name}</span>`
    ).join('');

    // divisor
    let divisor = document.querySelector('.modal-divisor');
    if (!divisor) {
        divisor = document.createElement('hr');
        divisor.className = 'modal-divisor';
        badgesEl.after(divisor);
    }

    // stats
    document.getElementById('modal-stats').innerHTML = p.stats.map(stat => `
        <div class="stat-linha">
            <span class="stat-nome">${stat.stat.name}</span>
            <span class="stat-valor">${stat.base_stat}</span>
            <div class="stat-barra-fundo">
                <div class="stat-barra" style="width: ${(stat.base_stat / 255) * 100}%"></div>
            </div>
        </div>
    `).join('');

    document.getElementById('modal-overlay').classList.add('ativo');
    document.body.style.overflow = 'hidden';
}

function fecharModal() {
    document.getElementById('modal-overlay').classList.remove('ativo');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') fecharModal();
});

async function buscarPokemon() {
    const termo = document.getElementById('pokemon-nome').value.toLowerCase().trim();
    if (!termo) return renderizar(listaPokemons);

    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${termo}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        renderizar([data]);
    } catch {
        pokedex.innerHTML = '<p style="text-align:center;color:#555;padding:40px 0;">Pokémon não encontrado.</p>';
    }
}

document.getElementById('pokemon-nome').addEventListener('keydown', e => {
    if (e.key === 'Enter') buscarPokemon();
});

function filtrarTipo() {
    const tipo = document.getElementById('typeFilter').value;
    if (!tipo) return renderizar(listaPokemons);

    const filtrados = listaPokemons.filter(p =>
        p.types.some(t => t.type.name === tipo)
    );
    renderizar(filtrados);
}

carregarPokemons();