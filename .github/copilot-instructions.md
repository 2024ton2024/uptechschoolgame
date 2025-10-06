# Up Tech School RPG - AI Assistant Instructions

This document provides guidance for AI assistants to effectively contribute to the Up Tech School RPG project.

## Project Overview & Architecture

This is a 2D RPG-style game built with HTML5, CSS, and JavaScript. It uses a combination of direct HTML/CSS for UI menus and the Phaser 3 framework for the core gameplay and world map.

The application is structured around different "screens" which are `div` elements in `index.html`. The visibility of these screens is managed in `js/main.js` by toggling the `.active` CSS class.

### Key Files & Directories

-   **`index.html`**: The main entry point. Defines all UI screens and game canvases.
-   **`js/main.js`**: The "controller" of the application. It handles UI events (button clicks), screen transitions, and initializes the game or map.
-   **`js/phaserGame.js`**: This is the main Phaser game scene. It's responsible for loading the tilemap, creating the player, and handling gameplay within a level.
-   **`js/mapPhaser.js`**: This is the Phaser scene for the world map. It displays nodes for different levels, connections, and player progress.
-   **`assets/tilemaps/map.json`**: The Tiled map file that defines the layout of the game world (levels and map). It's a critical asset.
-   **`package.json`**: Defines project dependencies (`phaser`) and scripts.

### Data Flow & State

1.  The user starts at the main menu (`#mainMenu` in `index.html`).
2.  `js/main.js` listens for button clicks to navigate between screens (e.g., story, instructions, map).
3.  When the user decides to play a level, `js/main.js` will hide the other screens and show the game screen, which contains the Phaser canvas.
4.  The game state (player position, unlocked levels) is primarily managed within the Phaser scenes (`phaserGame.js`, `mapPhaser.js`).

## Developer Workflows

### Running the Game

To run the game locally, you need a simple web server. The project is configured to use `http-server`.

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the server:
    ```bash
    npm start
    ```
    This will serve the game at `http://localhost:8000`.

### Editing the Map

The game world is designed using the [Tiled Map Editor](https://www.mapeditor.org/).
-   The main map file is `assets/tilemaps/map.json`.
-   To edit the world layout, collisions, or object placements, open this file in Tiled.
-   The tileset images are located in `assets/tilesets/`. Make sure the tileset name in Tiled (`TILED_TILESET_NAME` in `js/mapPhaser.js`) matches the configuration.

## Conventions & Patterns

-   **Screen Management**: All top-level UI views are `div` elements with the `screen` class in `index.html`. Logic in `js/main.js` controls which one is visible.
-   **Phaser Scenes**: The interactive parts of the game (map and gameplay) are implemented as Phaser Scenes.
    -   `MapScene` in `js/mapPhaser.js` is for the overworld map.
    -   The scene in `js/phaserGame.js` is for the actual level gameplay.
-   **Asset Loading**: All game assets (images, tilemaps) are loaded in the `preload()` function of the relevant Phaser scene.
-   **Legacy Code**: The files `js/game.js` and `js/map.js` contain older, non-Phaser implementations of the game and map. These are not currently used but are kept for reference. New features should be built within the Phaser framework.
