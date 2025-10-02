let mapCanvas, ctx, animationId;

export function startMap() {
    mapCanvas = document.getElementById('mapCanvas');
    ctx = mapCanvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animateMap();
}

export function stopMap() {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    mapCanvas.width = window.innerWidth;
    mapCanvas.height = window.innerHeight;
}

// Example: simple pulsating nodes along paths
const nodes = [
    { x: 300, y: 200, phase: 0 },
    { x: 600, y: 400, phase: Math.PI },
    // ... mais nós ...
];

function animateMap() {
    ctx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#0ff';
    ctx.beginPath();
    for (let i = 0; i < nodes.length - 1; i++) {
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[i+1].x, nodes[i+1].y);
    }
    ctx.stroke();

    // desenha nós pulsantes
    nodes.forEach(n => {
        const radius = 10 + 5 * Math.sin((Date.now() / 200) + n.phase);
        ctx.fillStyle = '#0ff';
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fill();
    });

    animationId = requestAnimationFrame(animateMap);
}