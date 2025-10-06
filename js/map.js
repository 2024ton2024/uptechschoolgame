// ============== MAPA NEON – JS PURO (Canvas 2D) ==============

const DPR = window.devicePixelRatio || 1;
let canvas, ctx, W, H;
let animationFrame = null;

// Camera (pan/zoom)
let cam = { x: 0, y: 0, z: 0.8 };

// Nodes array
const mapNodes = [
  {id:'start', label:'START: Fundamentos', x:0,   y:0,    icon:'chip',    unlocked:true,  completed:true},
  {id:'prog',  label:'Lógica & Python',    x:180, y:-40,  icon:'code',    unlocked:true,  completed:true},
  {id:'web',   label:'Web Básico',         x:360, y:-80,  icon:'globe',   unlocked:true,  completed:false},
  {id:'db',    label:'Bancos de Dados',    x:540, y:-40,  icon:'db',      unlocked:false, completed:false},
  {id:'git',   label:'Controle de Versão', x:120, y:120,  icon:'branch',  unlocked:true,  completed:true},
  {id:'oop',   label:'P.O.O.',             x:300, y:80,   icon:'cubes',   unlocked:true,  completed:false},
  {id:'api',   label:'APIs & REST',        x:480, y:40,   icon:'link',    unlocked:false, completed:false},
  {id:'sec',   label:'Segurança',          x:660, y:80,   icon:'shield',  unlocked:false, completed:false}
];

// Connections between nodes
const connections = [
  ['start', 'prog'],
  ['start', 'git'],
  ['prog', 'web'],
  ['web', 'db'],
  ['git', 'oop'],
  ['oop', 'api'],
  ['api', 'sec']
];

// Resize handler
function resize() {
  if (!canvas) return;
  
  W = canvas.offsetWidth;
  H = canvas.offsetHeight;
  
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  
  ctx.scale(DPR, DPR);
}

// Draw functions
function drawNode(node) {
  const x = node.x * cam.z + W/2 + cam.x;
  const y = node.y * cam.z + H/2 + cam.y;
  const r = 30 * cam.z;
  
  // Glow effect
  const glow = ctx.createRadialGradient(x, y, 0, x, y, r*1.5);
  glow.addColorStop(0, node.unlocked ? 'rgba(0,255,255,0.2)' : 'rgba(255,0,0,0.1)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(x-r*1.5, y-r*1.5, r*3, r*3);
  
  // Node circle
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2);
  ctx.fillStyle = node.unlocked ? '#001a1a' : '#1a0000';
  ctx.fill();
  ctx.strokeStyle = node.unlocked ? '#0ff' : '#f00';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Completion indicator
  if (node.completed) {
    ctx.beginPath();
    ctx.arc(x, y, r*0.7, 0, Math.PI*2);
    ctx.fillStyle = '#0f0';
    ctx.fill();
  }
  
  // Label
  ctx.fillStyle = '#fff';
  ctx.font = `${12*cam.z}px monospace`;
  ctx.textAlign = 'center';
  ctx.fillText(node.label, x, y + r*1.5);
}

function drawConnection(n1, n2) {
  const x1 = n1.x * cam.z + W/2 + cam.x;
  const y1 = n1.y * cam.z + H/2 + cam.y;
  const x2 = n2.x * cam.z + W/2 + cam.x;
  const y2 = n2.y * cam.z + H/2 + cam.y;
  
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  
  const unlocked = n1.unlocked && n2.unlocked;
  ctx.strokeStyle = unlocked ? '#0ff' : '#f00';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  if (unlocked) {
    // Animated flow effect
    const time = Date.now() / 1000;
    const length = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
    const segments = Math.ceil(length / 20);
    
    for (let i = 0; i < segments; i++) {
      const t = (i/segments + time) % 1;
      const x = x1 + (x2-x1) * t;
      const y = y1 + (y2-y1) * t;
      
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI*2);
      ctx.fillStyle = '#0ff';
      ctx.fill();
    }
  }
}

// Animation loop
function render() {
  // Clear
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  
  // Draw connections
  for (const [id1, id2] of connections) {
    const n1 = mapNodes.find(n => n.id === id1);
    const n2 = mapNodes.find(n => n.id === id2);
    drawConnection(n1, n2);
  }
  
  // Draw nodes
  for (const node of mapNodes) {
    drawNode(node);
  }
  
  // Continue animation
  animationFrame = requestAnimationFrame(render);
}

// Mouse interaction
let isDragging = false;
let lastX = 0;
let lastY = 0;

function onMouseDown(e) {
  isDragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
}

function onMouseMove(e) {
  if (!isDragging) return;
  
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  
  cam.x += dx;
  cam.y += dy;
  
  lastX = e.clientX;
  lastY = e.clientY;
}

function onMouseUp() {
  isDragging = false;
}

function onWheel(e) {
  const delta = e.deltaY > 0 ? 0.9 : 1.1;
  cam.z *= delta;
  cam.z = Math.max(0.5, Math.min(cam.z, 2));
  e.preventDefault();
}

// Initialization
export function initMap() {
  canvas = document.getElementById('stage');
  if (!canvas) return;
  
  ctx = canvas.getContext('2d');
  
  // Setup
  resize();
  window.addEventListener('resize', resize);
  
  // Mouse events
  canvas.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('wheel', onWheel);
  
  // Start animation
  render();
}

// Cleanup
export function cleanupMap() {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
  
  if (canvas) {
    window.removeEventListener('resize', resize);
    canvas.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    canvas.removeEventListener('wheel', onWheel);
  }
  
  canvas = null;
  ctx = null;
}
