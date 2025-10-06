// ============== MAPA NEON – JS PURO (Canvas 2D) ==============

const DPR = window.devicePixelRatio || 1;
const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');
let W, H; resize();

// Camera (pan/zoom)
let cam = { x: -300, y: -120, z: 1.1 };

// Nós e conexões (12 fases)
const nodes = [
  {id:'start', label:'START: Fundamentos', x:0,   y:0,    icon:'chip',    unlocked:true,  completed:true},
  {id:'prog',  label:'Lógica & Python',    x:180, y:-40,  icon:'code',    unlocked:true,  completed:true},
  {id:'web',   label:'Web Básico',         x:360, y:-80,  icon:'globe',   unlocked:true,  completed:false},
  {id:'db',    label:'Bancos de Dados',    x:540, y:-40,  icon:'db',      unlocked:false, completed:false},
  {id:'git',   label:'Controle de Versão', x:120, y:120,  icon:'branch',  unlocked:true,  completed:true},
  {id:'oop',   label:'P.O.O.',             x:300, y:80,   icon:'cubes',   unlocked:true,  completed:false},
  {id:'api',   label:'APIs & REST',        x:480, y:40,   icon:'link',    unlocked:false, completed:false},
  {id:'sec',   label:'Segurança',          x:660, y:80,   icon:'shield',  unlocked:false, completed:false},
  {id:'ci',    label:'CI/CD',              x:240, y:240,  icon:'gear',    unlocked:false, completed:false},
  {id:'cloud', label:'Cloud Basics',       x:420, y:200,  icon:'cloud',   unlocked:false, completed:false},
  {id:'ai',    label:'IA & ML',            x:600, y:240,  icon:'spark',   unlocked:false, completed:false},
  {id:'boss',  label:'Desafio Final',      x:780, y:160,  icon:'tower',   unlocked:false, completed:false},
];

const edges = [
  ['start','prog'], ['prog','web'], ['web','db'],
  ['start','git'], ['git','oop'], ['oop','api'], ['api','sec'],
  ['git','ci'], ['oop','cloud'], ['api','ai'], ['cloud','ai'], ['ai','boss']
];

updateProgress();

// Interação
let mouse = {x:0,y:0, worldX:0, worldY:0, down:false, lastX:0, lastY:0};
let hovered = null; let selected = nodes[0];

// Loop
let t0 = performance.now();
requestAnimationFrame(loop);
function loop(t){
  const dt = (t - t0)/1000; t0 = t;
  draw(dt);
  requestAnimationFrame(loop);
}

function draw(){
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,W,H);

  // fundo com glow + linhas
  drawGrid();

  // mundo
  ctx.setTransform(cam.z,0,0,cam.z, W/2 + cam.x*cam.z, H/2 + cam.y*cam.z);

  // conexões
  edges.forEach(([a,b],i)=>{
    const A = getNode(a), B = getNode(b);
    const pul = (Date.now()/1000 + i*0.2) % 1;
    neonLine(A.x, A.y, B.x, B.y, 5, pul);
  });

  // nós
  nodes.forEach(n=> drawNode(n, n===hovered || n===selected));
}

function drawGrid(){
  const g = ctx.createRadialGradient(W*0.55,H*0.45, 60, W*0.55,H*0.45, Math.max(W,H)*0.9);
  g.addColorStop(0, 'rgba(78,243,227,0.09)');
  g.addColorStop(1, 'rgba(11,16,22,0)');
  ctx.fillStyle = g; ctx.fillRect(0,0,W,H);

  ctx.save();
  ctx.globalAlpha = .35;
  ctx.strokeStyle = 'rgba(94,255,240,.25)';
  ctx.lineWidth = 1;
  for(let y=0;y<H;y+=40){ ctx.beginPath(); ctx.moveTo(0,y+.5); ctx.lineTo(W,y+.5); ctx.stroke(); }
  for(let x=0;x<W;x+=48){ ctx.beginPath(); ctx.moveTo(x+.5,0); ctx.lineTo(x+.5,H); ctx.stroke(); }
  ctx.restore();
}

function neonLine(x1,y1,x2,y2,w=4,pulse=0){
  ctx.save();
  ctx.strokeStyle = 'rgba(78,243,227,.25)';
  ctx.lineWidth = w*4; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();

  ctx.strokeStyle = '#6df7ff';
  ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();

  const px = x1 + (x2-x1)*pulse; const py = y1 + (y2-y1)*pulse;
  glowDot(px,py, w*1.2);
  ctx.restore();
}

function glowDot(x,y,r){
  const g = ctx.createRadialGradient(x,y, 0, x,y, r*6);
  g.addColorStop(0,'rgba(94,255,240,.9)');
  g.addColorStop(.2,'rgba(94,255,240,.35)');
  g.addColorStop(1,'rgba(94,255,240,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x,y,r*6,0,Math.PI*2); ctx.fill();
}

function drawNode(n, highlight=false){
  const w = 150, h = 86, r = 14;
  const x = n.x - w/2, y = n.y - h/2;

  ctx.save();
  const k = n.completed ? 1 : (n.unlocked? .7 : .35);
  ctx.globalAlpha = .9*k;
  ctx.fillStyle = 'rgba(20,40,60,.75)';
  roundRect(ctx,x,y,w,h,r,true,false);

  ctx.strokeStyle = n.unlocked? 'rgba(94,255,240,.85)': 'rgba(120,150,180,.35)';
  ctx.lineWidth = 2; roundRect(ctx,x,y,w,h,r,false,true);

  ctx.globalAlpha = .6*k; ctx.fillStyle = 'rgba(94,255,240,.07)';
  roundRect(ctx,x+6,y+6,w-12,h-12,r-8,true,false);
  ctx.restore();

  ctx.save(); ctx.fillStyle = '#d7fbff'; ctx.textAlign='left';
  drawIcon(n.icon, n.x- w/2 + 16, n.y-10, n.unlocked? 1: 0.55);
  ctx.globalAlpha = n.unlocked? 1: .55;
  ctx.font = '700 14px Outfit';
  ctx.fillText(n.label, n.x- w/2 + 54, n.y-6);
  ctx.font = '400 12px Outfit'; ctx.fillStyle = 'rgba(200,250,255,.9)';
  ctx.fillText(n.unlocked? (n.completed? 'Concluído' : 'Disponível') : 'Bloqueado', n.x- w/2 + 54, n.y+14);
  ctx.restore();

  if(highlight){ glowDot(n.x, n.y+h/2-6, 2.2); }
  if(!n.unlocked){
    ctx.save(); ctx.strokeStyle='rgba(255,100,120,.8)'; ctx.lineWidth=2; ctx.setLineDash([4,4]);
    roundRect(ctx,x-6,y-6,w+12,h+12,r+4,false,true); ctx.restore();
  }
}

function drawIcon(kind, x, y, alpha=1){
  ctx.save(); ctx.translate(x,y); ctx.globalAlpha = alpha; ctx.lineWidth=2; ctx.strokeStyle='#9af5ff';
  switch(kind){
    case 'chip': chip(); break; case 'code': code(); break; case 'globe': globe(); break; case 'db': db(); break;
    case 'branch': branch(); break; case 'cubes': cubes(); break; case 'link': link(); break; case 'shield': shield(); break;
    case 'gear': gear(); break; case 'cloud': cloud(); break; case 'spark': spark(); break; case 'tower': tower(); break;
  }
  ctx.restore();

  function chip(){
    ctx.strokeRect(0,0,28,28);
    for(let i=0;i<4;i++){
      ctx.beginPath(); ctx.moveTo(-6,4+i*6); ctx.lineTo(0,4+i*6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(28,4+i*6); ctx.lineTo(34,4+i*6); ctx.stroke();
    }
    ctx.strokeRect(6,6,16,16);
  }
  function code(){ ctx.beginPath(); ctx.moveTo(0,14); ctx.lineTo(10,4); ctx.moveTo(0,14); ctx.lineTo(10,24); ctx.moveTo(34,4); ctx.lineTo(24,14); ctx.lineTo(34,24); ctx.stroke(); }
  function globe(){ ctx.beginPath(); ctx.arc(16,14,12,0,Math.PI*2); ctx.moveTo(4,14); ctx.lineTo(28,14); ctx.moveTo(16,2); ctx.lineTo(16,26); ctx.moveTo(6,8); ctx.bezierCurveTo(16,12,16,16,26,20); ctx.stroke(); }
  function db(){ ctx.beginPath(); ctx.ellipse(16,6,14,6,0,0,Math.PI*2); ctx.moveTo(2,6); ctx.lineTo(2,22); ctx.moveTo(30,6); ctx.lineTo(30,22); ctx.moveTo(2,14); ctx.ellipse(16,14,14,6,0,0,Math.PI*2); ctx.moveTo(2,22); ctx.ellipse(16,22,14,6,0,0,Math.PI*2); ctx.stroke(); }
  function branch(){ ctx.beginPath(); ctx.arc(9,8,4,0,Math.PI*2); ctx.moveTo(9,12); ctx.lineTo(9,24); ctx.arc(23,12,4,0,Math.PI*2); ctx.moveTo(9,16); ctx.lineTo(23,16); ctx.stroke(); }
  function cubes(){ ctx.strokeRect(0,8,12,12); ctx.strokeRect(16,0,12,12); ctx.strokeRect(16,16,12,12); }
  function link(){ ctx.beginPath(); ctx.arc(10,14,8,0,Math.PI*2); ctx.moveTo(22,14); ctx.arc(22,14,8,0,Math.PI*2); ctx.moveTo(6,14); ctx.lineTo(26,14); ctx.stroke(); }
  function shield(){ ctx.beginPath(); ctx.moveTo(16,2); ctx.lineTo(28,8); ctx.lineTo(24,24); ctx.lineTo(8,24); ctx.lineTo(4,8); ctx.closePath(); ctx.stroke(); }
  function gear(){ for(let a=0;a<8;a++){ const ang=a*Math.PI/4; ctx.beginPath(); ctx.moveTo(16+Math.cos(ang)*12,14+Math.sin(ang)*12); ctx.lineTo(16+Math.cos(ang)*16,14+Math.sin(ang)*16); ctx.stroke(); } ctx.beginPath(); ctx.arc(16,14,8,0,Math.PI*2); ctx.moveTo(16,14); ctx.arc(16,14,3,0,Math.PI*2); ctx.stroke(); }
  function cloud(){ ctx.beginPath(); ctx.arc(10,18,6,Math.PI,.1); ctx.arc(16,12,8,Math.PI,.1); ctx.arc(24,18,6,Math.PI,.1); ctx.lineTo(6,18); ctx.stroke(); }
  function spark(){ ctx.beginPath(); ctx.moveTo(16,0); ctx.lineTo(12,14); ctx.lineTo(18,14); ctx.lineTo(10,30); ctx.stroke(); }
  function tower(){ ctx.strokeRect(10,0,12,18); ctx.beginPath(); ctx.moveTo(10,18); ctx.lineTo(6,28); ctx.lineTo(26,28); ctx.lineTo(22,18); ctx.closePath(); ctx.stroke(); }
}

function roundRect(ctx,x,y,w,h,r,fill,stroke){
  if(w<2*r) r = w/2; if(h<2*r) r=h/2;
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y, x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x, y+h, r);
  ctx.arcTo(x, y+h, x, y, r);
  ctx.arcTo(x, y, x+w, y, r);
  ctx.closePath();
  if(fill) ctx.fill(); if(stroke) ctx.stroke();
}

function getNode(id){ return nodes.find(n=>n.id===id); }

function updateProgress(){
  const done = nodes.filter(n=>n.completed).length;
  document.getElementById('progressText').textContent = `${done}/${nodes.length}`;
}

// -------- Input: pan/zoom/hover/select --------
canvas.addEventListener('mousedown', e=>{ mouse.down=true; mouse.lastX=e.clientX; mouse.lastY=e.clientY; });
window.addEventListener('mouseup', ()=> mouse.down=false);
window.addEventListener('mousemove', e=>{
  mouse.x = e.clientX; mouse.y = e.clientY;
  const invZ = 1/cam.z;
  mouse.worldX = (mouse.x - W/2)/cam.z - cam.x;
  mouse.worldY = (mouse.y - H/2)/cam.z - cam.y;
  if(mouse.down){
    cam.x += (mouse.x - mouse.lastX)/cam.z;
    cam.y += (mouse.y - mouse.lastY)/cam.z;
    mouse.lastX = mouse.x; mouse.lastY = mouse.y;
  }
  hovered = hitTest(mouse.worldX, mouse.worldY);
  showTip(hovered? hovered.label + (hovered.unlocked? (hovered.completed? ' — concluído' : ' — disponível') : ' — bloqueado') : null, e.clientX, e.clientY);
});

canvas.addEventListener('wheel', e=>{
  e.preventDefault();
  const scale = Math.exp(-e.deltaY * 0.001);
  // zoom ao redor do mouse
  const wx = (mouse.x - W/2)/cam.z - cam.x;
  const wy = (mouse.y - H/2)/cam.z - cam.y;
  cam.z *= scale; cam.z = Math.min(2.2, Math.max(0.6, cam.z));
  cam.x = (mouse.x - W/2)/cam.z - wx;
  cam.y = (mouse.y - H/2)/cam.z - wy;
},{passive:false});

window.addEventListener('keydown', e=>{
  if(e.key==='Enter' && selected && selected.unlocked){
    selected.completed = true; unlockNeighbors(selected.id); updateProgress();
  }
  if(e.key==='ArrowLeft') cam.x += 40;
  if(e.key==='ArrowRight') cam.x -= 40;
  if(e.key==='ArrowUp') cam.y += 40;
  if(e.key==='ArrowDown') cam.y -= 40;
  if(e.key==='+') cam.z=Math.min(2.2,cam.z*1.1);
  if(e.key==='-') cam.z=Math.max(0.6,cam.z/1.1);
});

canvas.addEventListener('click', ()=>{
  if(hovered){ selected = hovered; if(!selected.unlocked) pulseLock(selected); }
});

function hitTest(wx, wy){
  for(let i=nodes.length-1;i>=0;i--){
    const n = nodes[i]; const w=150, h=86;
    if(wx>n.x-w/2 && wx<n.x+w/2 && wy>n.y-h/2 && wy<n.y+h/2) return n;
  }
  return null;
}

function unlockNeighbors(id){
  edges.forEach(([a,b])=>{
    if(a===id) getNode(b).unlocked=true;
    if(b===id) getNode(a).unlocked=true;
  });
}

function pulseLock(n){
  const start = performance.now(); const dur=500;
  const raf = (t)=>{
    const k=Math.min(1,(t-start)/dur);
    const r= (1-k)*18+4;
    ctx.save();
    ctx.setTransform(cam.z,0,0,cam.z, W/2 + cam.x*cam.z, H/2 + cam.y*cam.z);
    ctx.strokeStyle='rgba(255,120,140,'+(1-k)+')';
    ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(n.x+60, n.y-28, r, 0, Math.PI*2); ctx.stroke();
    ctx.restore();
    if(k<1) requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

// Tooltip
const tip = document.getElementById('tip');
function showTip(text, x, y){
  if(!text){ tip.style.opacity=0; return; }
  tip.textContent = text; tip.style.left = x+'px'; tip.style.top = y+'px'; tip.style.opacity = 1;
}

// Resize / DPR
function resize(){
  W = canvas.width  = Math.floor(window.innerWidth * DPR);
  H = canvas.height = Math.floor(window.innerHeight * DPR);
  canvas.style.width  = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
}
window.addEventListener('resize', resize);