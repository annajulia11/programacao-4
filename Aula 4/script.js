let pontos = 0;
let tempo  = 15;
let ativo  = false;
let spawn, relogio;

const area    = document.getElementById('area');
const cursor  = document.getElementById('cursor');
const circulo = document.getElementById('cursor-circulo');

document.addEventListener('mousemove', function(e) {
  cursor.style.left  = e.clientX + 'px';
  cursor.style.top   = e.clientY + 'px';
  circulo.style.left = e.clientX + 'px';
  circulo.style.top  = e.clientY + 'px';

  const dot = document.createElement('div');
  dot.classList.add('rastro');
  dot.style.left = e.clientX + 'px';
  dot.style.top  = e.clientY + 'px';
  document.body.appendChild(dot);

  setTimeout(function() { dot.remove(); }, 500);
});

function iniciar() {
  pontos = 0;
  tempo  = 15;
  ativo  = true;

  document.getElementById('pontos').textContent = 0;
  document.getElementById('tempo').textContent  = 15;
  document.getElementById('popup').style.display = 'none';
  area.innerHTML = '';

  clearInterval(spawn);
  clearInterval(relogio);

  spawn = setInterval(function() {
    if (!ativo) return;

    const img = document.createElement('img');
    img.src = 'mask_yami.png';
    img.classList.add('mascara');
    img.style.left = Math.random() * (area.offsetWidth  - 80) + 'px';
    img.style.top  = Math.random() * (area.offsetHeight - 80) + 'px';

    area.appendChild(img);

    img.addEventListener('click', function() {
      pontos += 10;
      document.getElementById('pontos').textContent = pontos;
      img.remove();
    });

    setTimeout(function() {
      img.remove();
    }, 1000);

  }, 800);

  relogio = setInterval(function() {
    tempo--;
    document.getElementById('tempo').textContent = tempo;

    if (tempo <= 0) {
      ativo = false;
      clearInterval(spawn);
      clearInterval(relogio);
      area.innerHTML = '';
      document.getElementById('msg').textContent = 'Você fez ' + pontos + ' pontos!';
      document.getElementById('popup').style.display = 'block';
    }
  }, 1000);
}
