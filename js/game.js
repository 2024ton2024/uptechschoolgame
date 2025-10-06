// js/game.js

let canvas;
let ctx;
let animationFrameId = null;
let isGameRunning = false;
let resizeListenerAdded = false;
let backgroundImg = null;
let backgroundPattern = null;

// ===== Levels (para integrar com o mapa) =====
const LEVELS = {
  start: {
    displayName: 'Start • Fundamentos Tech',
    bgColor: '#0b1420',
    player: { x: 80, y: 80, color: '#18ffa6', speed: 2.2 }
  },
  lab: {
    displayName: 'Laboratório',
    bgColor: '#081826',
    player: { x: 120, y: 140, color: '#00ffff', speed: 2.4 }
  },
  robot: {
    displayName: 'Robótica',
    bgColor: '#0a0a0a',
    player: { x: 160, y: 120, color: '#e04dff', speed: 2.6 }
  },
  cloud: {
    displayName: 'Cloud',
    bgColor: '#07111c',
    player: { x: 200, y: 180, color: '#8a2be2', speed: 2.3 }
  },
  tower: {
    displayName: 'Tower (Boss)',
    bgColor: '#140a1c',
    player: { x: 100, y: 220, color: '#ff007f', speed: 2.8 }
  }
};

// ===== Player =====
const player = {
  x: 50,
  y: 50,
  width: 50,
  height: 50,
  color: '#e04dff',
  dx: 2,
  dy: 2
};

// === Neon Matrix Rain Background ===
const NEON_COLORS = ["#8a2be2", "#ff007f", "#00ffff", "#e04dff"];
const RAIN_CONFIG = {
  fontSize: 16,
  speedMin: 2,
  speedMax: 6,
  fade: 0.08,
  glyphs: "01<>[]{}/*#&@=+-",
};

let rainCols = [];
let rainDPR = 1;

// Utils
function rand(min, max) {
  return Math.random() * (max - min) + min;
}
function randChar(pool) {
  return pool[Math.floor(Math.random() * pool.length)];
}

function initBackground() {
  if (!canvas || !ctx) return;
  rainDPR = window.devicePixelRatio || 1;

  const fontPx = Math.max(10, Math.floor(RAIN_CONFIG.fontSize));
  ctx.font = `${fontPx}px monospace`;

  const colWidth = fontPx;
  const cssW = parseFloat(canvas.style.width) || canvas.width;
  const cols = Math.max(1, Math.floor(cssW / colWidth));

  rainCols = new Array(cols).fill(0).map((_, i) => ({
    x: i * colWidth,
    y: Math.floor(Math.random() * -200),
    speed: rand(RAIN_CONFIG.speedMin, RAIN_CONFIG.speedMax),
    color: NEON_COLORS[i % NEON_COLORS.length],
  }));
}

function updateBackground() {
  if (!canvas || !ctx || !rainCols.length) return;
  const h = parseFloat(canvas.style.height) || canvas.height;
  for (const col of rainCols) {
    col.y += col.speed;
    if (col.y > h + 100) {
      col.y = rand(-200, -20);
      col.speed = rand(RAIN_CONFIG.speedMin, RAIN_CONFIG.speedMax);
      col.color = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
    }
  }
}

function drawBackground(bgColor) {
  if (!canvas || !ctx) return;

  const w = parseFloat(canvas.style.width) || canvas.width;
  const h = parseFloat(canvas.style.height) || canvas.height;

  if (backgroundPattern) {
    ctx.fillStyle = backgroundPattern;
    ctx.fillRect(0, 0, w, h);
  } else {
    // Fallback to solid color if image not loaded
    ctx.fillStyle = bgColor || "#0a0a1a";
    ctx.fillRect(0, 0, w, h);
  }
}

// === Canvas Management ===
function setCanvasSize() {
  const gameScreen = document.getElementById('gameScreen');
  if (!canvas || !gameScreen) return;

  const cssWidth = Math.max(1, Math.floor(gameScreen.clientWidth * 0.9));
  const cssHeight = Math.max(1, Math.floor(gameScreen.clientHeight * 0.8));

  const dpr = window.devicePixelRatio || 1;
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;
  canvas.width = Math.floor(cssWidth * dpr);
  canvas.height = Math.floor(cssHeight * dpr);

  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  clampPlayerInside();
  initBackground(); // (re)inicializa a chuva neon ao redimensionar
}

function clampPlayerInside() {
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const maxX = (canvas.width / dpr) - player.width;
  const maxY = (canvas.height / dpr) - player.height;
  player.x = Math.min(Math.max(player.x, 0), Math.max(0, maxX));
  player.y = Math.min(Math.max(player.y, 0), Math.max(0, maxY));
}

function onResize() {
  if (!isGameRunning) return;
  setCanvasSize();
}

// === Init ===
function init(levelId = 'start') {
  canvas = document.getElementById('gameCanvas');
  if (!canvas) {
    console.error('Game canvas not found!');
    return false;
  }

  ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('2D context not available!');
    return false;
  }

  // Load background image
  if (!backgroundImg) {
    backgroundImg = new Image();
    backgroundImg.onload = () => {
      if (ctx) {
        backgroundPattern = ctx.createPattern(backgroundImg, 'repeat');
      }
    };
    backgroundImg.src = 'assets/images/background.png';
  }
  const cfg = LEVELS[levelId] || LEVELS.start;
  document.getElementById('gameScreen')?.style.setProperty('--level-name', `"${cfg.displayName}"`);

  // posiciona jogador conforme nível
  player.x = cfg.player.x;
  player.y = cfg.player.y;
  player.color = cfg.player.color;
  const baseSpeed = cfg.player.speed;
  player.dx = baseSpeed;
  player.dy = baseSpeed;

  setCanvasSize();

  if (!resizeListenerAdded) {
    window.addEventListener('resize', onResize);
    resizeListenerAdded = true;
  }

  // guarda a cor de fundo atual p/ draw
  initBackground();
  init.currentBg = cfg.bgColor;

  return true;
}

// === Game Logic ===
function update() {
  updateBackground();

  player.x += player.dx;
  player.y += player.dy;

  const dpr = window.devicePixelRatio || 1;
  const maxX = (canvas.width / dpr) - player.width;
  const maxY = (canvas.height / dpr) - player.height;
  if (player.x <= 0 || player.x >= maxX) player.dx *= -1;
  if (player.y <= 0 || player.y >= maxY) player.dy *= -1;
}

function draw() {
  if (!ctx || !canvas) return;

  // fundo + neon rain
  drawBackground(init.currentBg);

  // player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // HUD simples com nome do nível (usa var CSS opcional)
  ctx.fillStyle = '#a8f1ff';
  ctx.font = '16px Orbitron, monospace';
  ctx.fillText(getComputedStyle(document.getElementById('gameScreen')).getPropertyValue('--level-name').replace(/"/g,''), 12, 22);
}

function gameLoop() {
  if (!isGameRunning) return;
  // We don't need to call update() for a static background
  // update(); 
  draw();
  animationFrameId = requestAnimationFrame(gameLoop);
}

// === Controls ===
export function startGame(opts = {}) {
  if (isGameRunning) return;
  const levelId = opts.levelId || 'start';

  if (!init(levelId)) return;

  isGameRunning = true;          // 👈 agora entra no loop
  gameLoop();

  console.log('Game started!', { levelId });
}

export function stopGame() {
  if (!isGameRunning) return;
  isGameRunning = false;
  cancelAnimationFrame(animationFrameId);
  animationFrameId = null;

  if (ctx && canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  console.log('Game stopped!');
}
