// import { Intro } from "./scenes/intro";

var score = 0;
var scoreText;
var gameOver = false;
var touchingGround = false;
class Intro extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    // this.load.setBaseURL("https://labs.phaser.io");
    this.load.image("moon", "assets/img/moon.png");
    this.load.image("ground", "assets/img/cay/grass.png");
    this.load.image("cake", "assets/img/banh/banh1.png");
    this.load.image("bomb", "assets/img/bombcolor.png");
    this.load.spritesheet("rabit", "assets/img/tho/tho_anim_test.png", {
      frameWidth: 51.6,
      frameHeight: 43,
    });

    this.load.audio("bgMusic", "assets/audio/lampug_bg_game.mp3");
  }

  create() {
    let sfx = this.sound.add('bgMusic');
    sfx.play();

    this.cursors = this.input.keyboard.createCursorKeys();

    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x502a09, 0x3d2a05, 0x3d2a05, 0x372905, 45);
    graphics.fillRect(0, 0, this.scale.width, this.scale.height);

    const graphGround = this.add.graphics();
    graphGround.fillGradientStyle(0xff000f, 0xff000f, 0xff000f, 0x372905, 45);
    graphGround.fillRect(0, 900, this.scale.width, 30);

    this.add.image(120, 120, "moon").setOrigin(-2, 0.5).setScale(0.5);

    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 990, "ground").setScale(2).refreshBody();
    // const platforms = this.physics.add.existing(graphGround);
    // platforms.setCollideWorldBounds(true);

    this.player = this.physics.add.sprite(100, 450, "rabit");
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);

    // this.cameras.main.startFollow(this.player);

    this.physics.add.collider(this.player, platforms);

    this.cakes = this.physics.add.group({
      key: "cake",
      repeat: 15,
      setXY: { x: 10, y: 0, stepX: 50 },
    });

    this.cakes.displayHeight = 20;

    this.cakes.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      child.setScale(0.2, 0.2);
    });

    this.physics.add.collider(this.cakes, platforms);

    this.bombs = this.physics.add.group();

    this.physics.add.collider(this.bombs, platforms);
    this.physics.add.collider(this.player, this.bombs, hitBomb, null, this);

    this.physics.add.overlap(this.player, this.cakes, collectCake, null, this);

    function hitBomb(player, bomb) {
      this.physics.pause();
      player.setTint(0xff0000);
      player.anims.play("turn");
      gameOver = true;
      score = 0;
      const restart = setTimeout(() => {
        this.scene.start();
        clearTimeout(restart);
      }, 2000);
    }

    function collectCake(player, cake) {
      cake.disableBody(true, true);
      score += 1;
      scoreText.setText("Score: " + score);
      if (this.cakes.countActive(true) === 0) {
        this.cakes.children.iterate(function (child) {
          child.enableBody(true, child.x, 0, true, true);
        });

        var x =
          player.x < 400
            ? Phaser.Math.Between(400, 800)
            : Phaser.Math.Between(0, 400);

        var bomb = this.bombs.create(x, 16, "bomb");
        bomb.displayWidth = 30;
        bomb.displayHeight = 30;
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      }
    }

    scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "32px",
      fill: "#ffffff",
    });

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("rabit", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "rabit", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("rabit", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  update() {
    touchingGround = this.player.body.touching.down;

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);

      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);

      this.player.anims.play("right", true);
    } else if (touchingGround && this.cursors.up.isDown) {
      this.player.setVelocityY(-180);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play("turn");
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 900,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
    },
  },
  scale: {
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
  },
  scene: Intro,
};

const game = new Phaser.Game(config);
