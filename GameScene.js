class GameScene extends Phaser.Scene {
  constructor() {
    super("playGame");
  }

  preload() {
    let progressBar = this.add.graphics();
    let progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);
    let barWidth = this.cameras.main.width;
    let barHeight = this.cameras.main.height;
    let loadingText = this.make.text({
      x: barWidth / 2,
      y: barHeight / 2 - 50,
      text: "Loading...",
      style: {
        font: "20px monospace",
        fill: "#ffffff",
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    this.load.on("progress", function (value) {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on("fileprogress", function (file) {});

    this.load.on("complete", function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    this.load.image("sky", "assets/nebulaAquaPink.png");
    this.load.image("sky-stars", "assets/starsSmall.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("moon", "assets/moon.png");
    this.load.image("lavaMoon", "assets/lavaMoon.png");
    this.load.image("iceMoon", "assets/iceMoon.png");
    this.load.image("star", "assets/star.png");
    this.load.spritesheet("player", "assets/miniRobot.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.audio("music", "assets/spaceMusic.wav");
    this.load.audio("starCollected", "assets/starCollected.wav");
    this.load.audio("gameOver", "assets/gameOver.wav");
  }

  create() {
    this.add.image(800, 600, "sky").setOrigin(0.5).setScale(0.5);

    this.add.image(400, 300, "sky-stars").setOrigin(0.5).setScale(0.5);

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, "ground").setScale(2).refreshBody();

    platforms.create(600, 400, "ground");
    platforms.create(50, 250, "ground");
    platforms.create(750, 220, "ground");

    player = this.physics.add.sprite(100, 450, "player");

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    collectSound = this.sound.add("starCollected", { loop: false });
    gameOverSound = this.sound.add("gameOver", { loop: false });
    music = this.sound.add("music", { loop: false, volume: 0.5 });
    music.play();

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 3,
        end: 6,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player", {
        start: 0,
        end: 2,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 3,
        end: 6,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("player", {
        start: 7,
        end: 12,
      }),
      frameRate: 18,
      repeat: 0,
    });

    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
      key: "star",
      repeat: 9,
      setXY: { x: 40, y: 0, stepX: 80 },
    });

    stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)).setScale(0.5);
    });

    this.physics.add.collider(stars, platforms);

    this.physics.add.overlap(player, stars, collectStars, null, this);

    scoreText = this.add.text(16, 16, "SCORE: 0", {
      fontSize: "32px",
      fill: "#ffffff",
    });

    spaceDebris = this.physics.add.group();

    this.physics.add.collider(spaceDebris, platforms);

    this.physics.add.collider(player, spaceDebris, hitDebris, null, this);
  }

  update() {
    if (cursors.left.isDown && player.body.touching.down) {
      player.setVelocityX(-160);
      player.anims.play("left", true);
      player.flipX = true;
    } else if (cursors.left.isDown && !player.body.touching.down) {
      player.setVelocityX(-160);
      player.flipX = true;
    } else if (cursors.right.isDown && player.body.touching.down) {
      player.setVelocityX(160);
      player.anims.play("right", true);
      player.flipX = false;
    } else if (cursors.right.isDown && !player.body.touching.down) {
      player.setVelocityX(160);
      player.flipX = false;
    } else if (player.body.touching.down) {
      player.setVelocityX(0);
      player.anims.play("idle", true);
    }

    if (
      cursors.up.isDown &&
      Phaser.Input.Keyboard.JustDown(cursors.up) &&
      player.body.touching.down
    ) {
      player.anims.play("up", true);
      player.setVelocityY(-330);
    }
  }
}
