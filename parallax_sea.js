/* 
For pictures with parallax effect.
Creates a picture that simulates depth by moving depending
on cursor position.
*/
var config = {
    type: Phaser.AUTO,
    width: 700,
    height: 500,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            fps: 30
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var bubbles;

function preload ()
{
    this.load.image('layer1', 'assets/layer1.png');
    this.load.image('layer2', 'assets/layer2.png');
    this.load.image('layer3', 'assets/layer3.png');
    this.load.image('layer4', 'assets/layer4.png');
    this.load.image('layer5', 'assets/layer5.png');
    this.load.image('bubble', 'assets/bubble.png');
    this.load.image('fish1', 'assets/fish1.png');
    this.load.image('fish2', 'assets/fish2.png');
    this.load.audio('underwater', 'assets/underwater.wav');
}

function create ()
{
    // sound
    underwatersound = this.sound.add('underwater');
    underwatersound.play();
    underwatersound.loop = true;
    // the background layers
    layer1 = this.physics.add.sprite(350, 250, 'layer1');
    layer2 = this.physics.add.sprite(350, 250, 'layer2');
    // the middle layer elements
    // bubbles
    bubbles = this.physics.add.group({
        key: 'bubble',
        repeat: 3,
        setXY: { x: 40, y: 550, stepX: 180 }
    });
    bubbles.children.iterate(function (child) {
        // Give each bubble a slightly different speed
        child.setVelocityY(Phaser.Math.Between(-60, -10));
        child.setVelocityX(Phaser.Math.Between(-15, 15));
        child.setScale(Phaser.Math.FloatBetween(0.4, 0.6),Phaser.Math.FloatBetween(0.4, 0.6));
    });
    // fish
    fish1 = this.physics.add.group({
        key: 'fish1',
        repeat: 1,
        setXY: { x: 750, y: 100, stepX: 60, stepY:70 }
    });
    fish1.children.iterate(function (child) {
        //  Give each bubble a slightly different speed
        child.setVelocityX(Phaser.Math.Between(-60, -50));
    });
    fish2 = this.physics.add.sprite(-100, 290, 'fish2');
    fish2.body.velocity.setTo(50,0);
    // the foreground layers
    layer3 = this.physics.add.sprite(350, 250, 'layer3');
    layer4 = this.physics.add.sprite(350, 250, 'layer4');
    layer5 = this.physics.add.sprite(350, 250, 'layer5');
}

function update ()
{
    // saves the current position
    var xpos = this.input.activePointer.x;
    var ypos = this.input.activePointer.y;
    // changes positions of layers on the screen
    // layers closer to camera are moved more
    layer1.x = 350 + (xpos-350)*0.02;
    layer1.y = 250 + (ypos-250)*0.02;
    layer2.x = 350 + (xpos-350)*0.01;
    layer2.y = 250 + (ypos-250)*0.01;
    layer3.x = 350 - (xpos-350)*0.05;
    layer3.y = 250 - (ypos-250)*0.05;
    layer4.x = 350 - (xpos-350)*0.12;
    layer4.y = 250 - (ypos-250)*0.12;
    layer5.x = 350 - (xpos-350)*0.15;
    layer5.y = 250 - (ypos-250)*0.15; 
    // movement of bubbles
    bubbles.children.iterate(function (child) {
        // let the bubble appear at the bottom again if it's on top
        if(child.y<(-20)){
            child.y=550;
            child.setVelocityY(Phaser.Math.Between(-60, -10));
        }
        // let the bubble appear at the bottom again if it leaves the screen at the side
        if(child.x<(-20) || child.x>720){
            child.y=550;
            child.x=Phaser.Math.Between(30, 670);
            child.setVelocityY(Phaser.Math.Between(-60, -10));
        }
        // change direction with chance of 2% per frame
        if(Math.random()<0.02){
            child.setVelocityX(Phaser.Math.Between(-15, 15));
        }
    });
    // movement of fish1
    fish1.children.iterate(function (child) {
        // let the fish appear right again
        if(child.x<(-100)){
            child.x=750;
            child.setVelocityX(Phaser.Math.Between(-60, -50));
        }
        // let the fish appear at the right again if it leaves the screen at the side
        if(child.y<(-80) || child.y>550){
            child.x=750;
            child.y=Phaser.Math.Between(50, 450);
            child.setVelocityX(Phaser.Math.Between(-60, -50));
        }
        // change direction with chance of 2% per frame
        if(Math.random()<0.02){
            child.setVelocityY(Phaser.Math.Between(-15, 15));
            fish2.setVelocityY(Phaser.Math.Between(-15, 15))
        }
    });
    // movement of fish2
    if(fish2.x>750){
        fish2.x=-100;
        fish2.setVelocityX(Phaser.Math.Between(50, 60));
    }
    // let the fish appear at the left again if it leaves the screen at the side
    if(fish2.y<(-80) || fish2.y>550){
        fish2.x=-100;
        fish2.y=Phaser.Math.Between(50, 450);
        fish2.setVelocityX(Phaser.Math.Between(50, 60));
    }
}