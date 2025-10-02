// js/game.js

let canvas;
let ctx;
let animationFrameId = null;
let isGameRunning = false;
let resizeListenerAdded = false;

// Player
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
  const cols = Math.max(1, Math.floor((parseFloat(canvas.style.width) || canvas.width) / colWidth));

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

function drawBackground() {
  if (!canvas || !ctx) return;

  const w = parseFloat(canvas.style.width) || canvas.width;
  const h = parseFloat(canvas.style.height) || canvas.height;

  ctx.save();
  ctx.globalAlpha = RAIN_CONFIG.fade;
  ctx.fillStyle = "#0a0a1a";
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  const fontPx = Math.max(10, Math.floor(RAIN_CONFIG.fontSize));
  ctx.font = `${fontPx}px monospace`;
  for (const col of rainCols) {
    const ch = randChar(RAIN_CONFIG.glyphs);
    ctx.fillStyle = col.color;
    ctx.fillText(ch, col.x, col.y);
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

  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  clampPlayerInside();
  initBackground(); // recalcula colunas ao redimensionar
}

function clampPlayerInside() {
  if (!canvas) return;
  const maxX = (canvas.width / (window.devicePixelRatio || 1)) - player.width;
  const maxY = (canvas.height / (window.devicePixelRatio || 1)) - player.height;
  player.x = Math.min(Math.max(player.x, 0), Math.max(0, maxX));
  player.y = Math.min(Math.max(player.y, 0), Math.max(0, maxY));
}

function onResize() {
  if (!isGameRunning) return;
  setCanvasSize();
}

// === Init ===
function init() {
  canvas = document.getElementById('gameCanvas');
  if (!canvas) {
    console.error('Game canvas not found!');
    return false;
  }

  const gameScreen = document.getElementById('gameScreen');
  if (!gameScreen) {
    console.error('Game screen container (#gameScreen) not found!');
    return false;
  }

  ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('2D context not available!');
    return false;
  }

  setCanvasSize();

  if (!resizeListenerAdded) {
    window.addEventListener('resize', onResize);
    resizeListenerAdded = true;
  }

  return true;
}

// === Game Logic ===
function update() {
  updateBackground();

  player.x += player.dx;
  player.y += player.dy;

  const maxX = (canvas.width / (window.devicePixelRatio || 1)) - player.width;
  const maxY = (canvas.height / (window.devicePixelRatio || 1)) - player.height;
  if (player.x <= 0 || player.x >= maxX) player.dx *= -1;
  if (player.y <= 0 || player.y >= maxY) player.dy *= -1;
}

function draw() {
  if (!ctx || !canvas) return;

  drawBackground(); // desenha primeiro o fundo

  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function gameLoop() {
  if (!isGameRunning) return;
  update();
  draw();
  animationFrameId = requestAnimationFrame(gameLoop);
}

// === Controls ===
export function startGame() {
  if (isGameRunning) return;
  if (!init()) return;
  isGameRunning = true;
  gameLoop();
  console.log('Game started!');
}

export function stopGame() {
  if (!isGameRunning) return;
  isGameRunning = false;
  cancelAnimationFrame(animationFrameId);
  if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
  console.log('Game stopped!');
}
