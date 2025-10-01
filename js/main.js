import { startGame, stopGame } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
    const mainMenu = document.getElementById('mainMenu');
    const gameScreen = document.getElementById('gameScreen');
    const instructionsScreen = document.getElementById('instructionsScreen');

    const playButton = document.getElementById('playButton');
    const backToMenuButton = document.getElementById('backToMenuButton');
    const instructionsButton = document.getElementById('instructionsButton');
    const backFromInstructionsButton = document.getElementById('backFromInstructionsButton');

    function showScreen(screenToShow) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        // Show the requested screen
        screenToShow.classList.add('active');
    }

    // Game screen navigation
    playButton.addEventListener('click', () => {
        showScreen(gameScreen);
        startGame();
    });

    backToMenuButton.addEventListener('click', () => {
        stopGame();
        showScreen(mainMenu);
    });

    // Instructions screen navigation
    instructionsButton.addEventListener('click', () => {
        showScreen(instructionsScreen);
    });

    backFromInstructionsButton.addEventListener('click', () => {
        showScreen(mainMenu);
    });

    // Placeholder for other buttons
    document.getElementById('skinsButton').addEventListener('click', () => alert('Skins screen coming soon!'));
    document.getElementById('knowledgePassButton').addEventListener('click', () => alert('Knowledge Pass screen coming soon!'));
});


