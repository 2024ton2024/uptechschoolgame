// js/game.js

let canvas;
let ctx;
let animationFrameId;
let isGameRunning = false;

const player = {
    x: 50,
    y: 50,
    width: 50,
    height: 50,
    color: '#e04dff',
    dx: 2, // horizontal speed
    dy: 2  // vertical speed
};

function init() {
    canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error("Game canvas not found!");
        return;
    }
    ctx = canvas.getContext('2d');

    // Set canvas size based on its container
    const gameScreen = document.getElementById('gameScreen');
    canvas.width = gameScreen.clientWidth * 0.9;
    canvas.height = gameScreen.clientHeight * 0.8;


    window.addEventListener('resize', () => {
        if (isGameRunning) {
            canvas.width = gameScreen.clientWidth * 0.9;
            canvas.height = gameScreen.clientHeight * 0.8;
        }
    });
}

function update() {
    // Move the player
    player.x += player.dx;
    player.y += player.dy;

    // Wall collision detection
    if (player.x + player.width > canvas.width || player.x < 0) {
        player.dx *= -1;
    }
    if (player.y + player.height > canvas.height || player.y < 0) {
        player.dy *= -1;
    }
}

function draw() {
    // Clear the canvas for the new frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function gameLoop() {
    if (!isGameRunning) return;
    update();
    draw();
    animationFrameId = requestAnimationFrame(gameLoop);
}

export function startGame() {
    if (isGameRunning) return;
    isGameRunning = true;
    init();
    gameLoop();
    console.log("Game started!");
}

export function stopGame() {
    if (!isGameRunning) return;
    isGameRunning = false;
    cancelAnimationFrame(animationFrameId);
    // Clear canvas
    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    console.log("Game stopped!");
}

// Export functions to be used in main.js
export function startGame() {
    init();
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    gameLoop();
}

export function stopGame() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
}
