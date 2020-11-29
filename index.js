let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [TitleScene, GameScene],
};

let game = new Phaser.Game(config);

let player;
let stars;
let platforms;
let cursors;
let score = 0;
let scoreText;
let spaceDebris;
let highScore = 0;
let highScoreText;
let music;
let collectSound;
let gameOverSound;

function collectStars(player, star) {
  collectSound.play();
  star.disableBody(true, true);

  score += 10;
  scoreText.setText("SCORE: " + score);

  if (stars.countActive(true) === 0) {
    stars.children.iterate(function (child) {
      child.enableBody(true, child.x, 0, true, true);
    });
    let x =
      player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);

    let fallenSpaceDebris = spaceDebris
      .create(x, 16, Phaser.Math.RND.pick(["moon", "lavaMoon", "iceMoon"]))
      .setScale(0.5);
    fallenSpaceDebris.setBounce(1);
    fallenSpaceDebris.setCollideWorldBounds(true);
    fallenSpaceDebris.setVelocity(Phaser.Math.Between(-200, 200), 20);
  }
}

function hitDebris(player, fallenSpaceDebris) {
  gameOverSound.play();
  this.physics.pause();
  player.setTint(0xff0000);
  player.anims.play("idle");
  if (score > highScore) {
    highScore = score;
  }
  this.add.text(400, 250, "GAME OVER", { fontSize: "32px" }).setOrigin(0.5);
  this.add.text(400, 300, `SCORE: ${score}`).setOrigin(0.5);
  this.add.text(400, 350, `HIGH SCORE: ${highScore}`).setOrigin(0.5);
  this.add.text(400, 400, `CLICK TO RESTART`).setOrigin(0.5);
  gameOver = true;
  this.input.on("pointerdown", () => {
    music.destroy();
    score = 0;
    this.registry.destroy();
    this.events.off();
    this.scene.restart();
  });
}
