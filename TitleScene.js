class TitleScene extends Phaser.Scene {
  constructor() {
    super("bootGame");
  }

  create() {
    this.add.text(400, 300, "MOONSHOT", { fontSize: "32px" }).setOrigin(0.5);
    this.add.text(400, 350, "CLICK TO PLAY").setOrigin(0.5);
    this.input.on("pointerdown", () => {
      this.scene.start("playGame");
    });
  }
}
