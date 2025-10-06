import { startGame as startGameOriginal, stopGame } from './game.js?v=2';
import { initMap, cleanupMap } from './map.js';

// Screen management function
function showScreen(screenToShow) {
  console.log('Showing screen:', screenToShow.id);
  
  // Hide all screens first
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
    // Make sure game screen is hidden
    if (screen.id === 'gameScreen') {
      screen.style.display = 'none';
    }
  });
  
  // Show the selected screen
  screenToShow.classList.add('active');
  if (screenToShow.id === 'gameScreen') {
    screenToShow.style.display = 'block';
  }
  
  // Update the page name first
  const updateTimeEl = document.getElementById('updateTime');
  if (updateTimeEl) {
    switch(screenToShow.id) {
      case 'mainMenu':
        updateTimeEl.textContent = 'HOME';
        break;
      case 'mapScreen':
        updateTimeEl.textContent = 'MAPA';
        break;
      case 'gameScreen':
        updateTimeEl.textContent = 'JOGO';
        break;
      case 'instructionsScreen':
        updateTimeEl.textContent = 'INSTRUÇÕES';
        break;
      case 'storyScreen':
        updateTimeEl.textContent = 'HISTÓRIA';
        break;
    }
  }
  
  // Then handle stopping/starting games after screen transition
  if (screenToShow.id !== 'gameScreen') {
    stopGame();
  }
  if (screenToShow.id !== 'mapScreen') {
    cleanupMap();
  }
  if (screenToShow.id === 'mapScreen') {
    console.log('Starting map...');
    initMap();
  }
}

// Story setup
let currentStoryIndex = 0;
const storyPages = [
  "In the year 2099, humanity lives connected to a vast network called the Grid, controlled by megacorporations that dominate information and technology.",
  "A mysterious new force known as the Shadow of Code threatens to corrupt systems and bring down digital civilization.",
  "Heroes of Code emerge from the Up-Tech School to defend data and restore balance.",
  "Your journey begins now!"
];

function startStory() {
  currentStoryIndex = 0;
  const storyContent = document.getElementById('storyContent');
  if (storyContent) {
    storyContent.innerText = storyPages[0];
  }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing game...');

  // Get all screen elements
  const mainMenu = document.getElementById('mainMenu');
  const gameScreen = document.getElementById('gameScreen');
  const instructionsScreen = document.getElementById('instructionsScreen');
  const mapScreen = document.getElementById('mapScreen');
  const storyScreen = document.getElementById('storyScreen');
  const updateTimeEl = document.getElementById('updateTime');

  // Initialize home screen
  if (updateTimeEl) {
    updateTimeEl.textContent = 'HOME';
  }
  if (mainMenu) {
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });
    mainMenu.classList.add('active');
  }

  // Story navigation
  const nextStoryButton = document.getElementById('nextStoryButton');
  const skipStoryButton = document.getElementById('skipStoryButton');
  const storyContent = document.getElementById('storyContent');

  nextStoryButton?.addEventListener('click', () => {
    currentStoryIndex++;
    if (currentStoryIndex < storyPages.length) {
      if (storyContent) {
        storyContent.innerText = storyPages[currentStoryIndex];
      }
    } else {
      if (mapScreen) {
        console.log('Story complete, showing map...');
        showScreen(mapScreen);
      }
    }
  });

  skipStoryButton?.addEventListener('click', () => {
    if (mapScreen) {
      console.log('Skipping story, showing map...');
      showScreen(mapScreen);
    }
  });

  // Menu buttons
  const playButton = document.getElementById('playButton');
  playButton?.addEventListener('click', () => {
    if (storyScreen) {
      showScreen(storyScreen);
      startStory();
    }
  });

  const instructionsButton = document.getElementById('instructionsButton');
  instructionsButton?.addEventListener('click', () => {
    if (instructionsScreen) {
      showScreen(instructionsScreen);
    }
  });

  // Back buttons
  const backFromInstructionsButton = document.getElementById('backFromInstructionsButton');
  backFromInstructionsButton?.addEventListener('click', () => {
    if (mainMenu) {
      showScreen(mainMenu);
    }
  });

  // Map controls
  const mapBackButton = document.getElementById('mapBackButton');
  const mapPlayButton = document.getElementById('mapPlayButton');
  const mapInstructionsBtn = document.getElementById('mapInstructionsBtn');

  mapBackButton?.addEventListener('click', () => {
    if (mainMenu) {
      cleanupMap();
      showScreen(mainMenu);
    }
  });

  mapPlayButton?.addEventListener('click', () => {
    if (gameScreen) {
      stopMap();
      showScreen(gameScreen);
      startGameOriginal();
    }
  });

  mapInstructionsBtn?.addEventListener('click', () => {
    if (instructionsScreen) {
      stopMap();
      showScreen(instructionsScreen);
    }
  });
});