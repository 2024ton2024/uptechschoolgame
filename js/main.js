import { startGame as startGameOriginal, stopGame } from './game.js';
import { startMap, stopMap } from './map.js';

document.addEventListener('DOMContentLoaded', () => {
    const mainMenu = document.getElementById('mainMenu');
    const gameScreen = document.getElementById('gameScreen');
    const instructionsScreen = document.getElementById('instructionsScreen');
    const mapScreen = document.getElementById('mapScreen');

    const playButton = document.getElementById('playButton');
    const backToMenuButton = document.getElementById('backToMenuButton');
    const instructionsButton = document.getElementById('instructionsButton');
    const backFromInstructionsButton = document.getElementById('backFromInstructionsButton');
    const mapButton = document.getElementById('mapButton');
    const backFromMapButton = document.getElementById('backFromMapButton');

    // Story screen elements & logic
    const storyScreen = document.getElementById('storyScreen');
    const storyContent = document.getElementById('storyContent');
    const nextStoryButton = document.getElementById('nextStoryButton');
    const skipStoryButton = document.getElementById('skipStoryButton');
    const storyPages = [
        "In the year 2099, humanity lives connected to a vast network called the Grid, controlled by megacorporations that dominate information and technology.",
        "However, a mysterious new force known as the Shadow of Code threatens to corrupt systems, destroy data, and bring down digital civilization.",
        "The only defense of humanity lies in young apprentices who study at the Up-Tech School, a secret academy that trains the Heroes of Code.",
        "You are one of these students, and you must develop your skills to face the threats of the technological world.",
    ];
    let currentStoryIndex = 0;

    function startStory() {
        currentStoryIndex = 0;
        storyContent.innerText = storyPages[currentStoryIndex];
    }

    nextStoryButton.addEventListener('click', () => {
        currentStoryIndex++;
        if (currentStoryIndex < storyPages.length) {
            storyContent.innerText = storyPages[currentStoryIndex];
        } else {
            showScreen(gameScreen);
            startGameOriginal();
        }
    });

    skipStoryButton.addEventListener('click', () => {
    showScreen(gameScreen);
    startGameOriginal();
    });

    function showScreen(screenToShow) {
        // Hide all screens
        const screens = document.querySelectorAll('.screen');
        for (let i = 0; i < screens.length; i++) {
            screens[i].classList.remove('active');
        }
        // Show the requested screen
        screenToShow.classList.add('active');
    }

    // Game screen navigation (now via story)
    playButton.addEventListener('click', () => {
        showScreen(storyScreen);
        startStory();
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
    
    // Map screen navigation
    mapButton.addEventListener('click', () => {
        showScreen(mapScreen);
        startMap();
    });
    backFromMapButton.addEventListener('click', () => {
        stopMap();
        showScreen(mainMenu);
    });
});



