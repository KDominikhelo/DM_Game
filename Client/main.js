// Definiáljuk a játék táblát
const canvas = document.createElement('canvas');
canvas.width = 500;
canvas.height = 500;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Definiáljuk a játékos osztályt
class Player {
  constructor(id, x, y, radius) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  // Kirajzoljuk a játékost a vásznon
  draw() {
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Az aktuális játékos
let currentPlayer;

// A socket.io kapcsolat
const socket = io();

// A szerverről kapott játékosokat tároló tömb
const players = [];

// Az új játékos hozzáadása
socket.on('newPlayer', data => {
  const newPlayer = new Player(data.id, data.x, data.y, 10);
  players.push(newPlayer);
});

// A játékosok frissítése
socket.on('updatePlayers', data => {
  for (let i = 0; i < data.length; i++) {
    const player = players.find(p => p.id === data[i].id);
    if (player) {
      player.x = data[i].x;
      player.y = data[i].y;
    }
  }
});

// A játékos mozgatása
function movePlayer() {
  document.addEventListener('keydown', event => {
    switch (event.keyCode) {
      case 87: // w
        socket.emit('move', { x: currentPlayer.x, y: currentPlayer.y - 10 });
        break;
      case 65: // a
        socket.emit('move', { x: currentPlayer.x - 10, y: currentPlayer.y });
        break;
      case 83: // s
        socket.emit('move', { x: currentPlayer.x, y: currentPlayer.y + 10 });
        break;
      case 68: // d
        socket.emit('move', { x: currentPlayer.x + 10, y: currentPlayer.y });
        break;
    }
  });
}

// A játékos hozzáadása és az update függvény indítása
socket.on('connect', () => {
  socket.on('playerId', id => {
    currentPlayer = new Player(id, 250, 250, 10);
    players.push(currentPlayer);
    movePlayer();
    requestAnimationFrame(update);
  });
});

// Frissítjük a játékteret a játékosok koordinátái alapján
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < players.length; i++) {
    players[i].draw();
  }
  requestAnimationFrame(update);
}
