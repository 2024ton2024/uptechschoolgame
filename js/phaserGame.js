import Phaser from 'phaser';

// Configuração básica do Phaser para renderizar o mapa
const mapContainer = document.getElementById('mapScreen');
const config = {
  type: Phaser.AUTO,
  width: mapContainer.clientWidth,
  height: mapContainer.clientHeight,
  parent: 'mapScreen', // Container onde o canvas será injetado (exibição do mapa)
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

export const phaserGame = new Phaser.Game(config);

function preload() {
  // Tilesets e mapas gerados no Tiled
  this.load.image('tiles', 'assets/tilesets/Tiles.png'); // key 'tiles' for tileset image
  this.load.tilemapTiledJSON('map', 'assets/tilemaps/map.json');
  // Sprite do player
  if (!this.textures.exists('player')) {
    // placeholder se faltar o sprite real
    this.textures.generate('player-placeholder', { data: ['X'], pixelWidth: 1, pixelHeight: 1 });
    this.load.image('player', 'assets/images/player.png');
  } else {
    this.load.image('player', 'assets/images/player.png');
  }
}

let playerSprite;
function create() {
  // Cria o mapa a partir do JSON do Tiled
  const map = this.make.tilemap({ key: 'map' });
  const tileset = map.addTilesetImage('tileset-name', 'tiles'); // use the tileset name from map.json
  const backgroundLayer = map.createLayer('Background', tileset);
  const collisionLayer = map.createLayer('Collisions', tileset);
  collisionLayer.setCollisionByProperty({ collides: true });

  // Cria sprite do jogador com física
  playerSprite = this.physics.add.sprite(100, 100, 'player');
  this.physics.add.collider(playerSprite, collisionLayer);

  // Câmera segue o jogador
  this.cameras.main.startFollow(playerSprite);
}

function update() {
  // Aqui você pode adicionar controles do jogador
  const cursors = this.input.keyboard.createCursorKeys();
  playerSprite.setVelocity(0);

  if (cursors.left.isDown) playerSprite.setVelocityX(-200);
  else if (cursors.right.isDown) playerSprite.setVelocityX(200);

  if (cursors.up.isDown) playerSprite.setVelocityY(-200);
  else if (cursors.down.isDown) playerSprite.setVelocityY(200);
}