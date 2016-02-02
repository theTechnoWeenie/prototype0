var Proto0 = Proto0 || {};
var INIT_BUMP = 150;
var ACCELERATION = 150;
var MAX_DECREASE = 5;
var MAX_SPEED = 300;
Proto0.Play = function(game){
  this.dude = null;
  this.levelIndex = 0;
  this.levels = [];
  this.currentLevel = {};
  this.blinkTimer = null;
  this.walls = null;
  this.controls = null;
};

Proto0.Play.prototype = {
  preload: function(){
    this.levels = game.cache.getJSON('levels');
    for(var levelIndex in this.levels){
      game.load.json(this.levels[levelIndex], 'assets/levels/' + this.levels[levelIndex]);
    }
    game.load.spritesheet('dude', 'assets/gizmo.png', 64, 64);
    game.load.spritesheet('wall_tile', 'assets/wall.png', 64, 64);
    game.load.spritesheet('corner', 'assets/lower_left_corner.png', 64, 64);
  },

  create: function(){
    this.currentLevel = game.cache.getJSON(this.levels[++(this.levelIndex)]);
    game.stage.backgroundColor = '#FFF';
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.placeProtagonist();
    this.placeWalls();

    this.controls = game.input.keyboard.createCursorKeys();
  },

  update: function() {
    this.moveDude();
  },

  blink: function(){
    this.dude.animations.play('blink');
    var dude = this.dude;
    setTimeout(function(dude){
      dude.animations.stop('blink');
      dude.frame = 0;
    }, 1010, dude);
  },
  placeProtagonist: function(){
    this.dude = game.add.sprite(game.width / 2, game.height / 2,'dude');
    game.physics.arcade.enable(this.dude);
    game.physics.arcade.enable(this.dude);
    this.dude.animations.add('blink', [0,1,2,3,4,5], 5, true);
    this.dude.scale.y = 0.5;
    this.dude.scale.x = 0.5;
    this.blinkTimer = game.time.events.loop(Phaser.Timer.SECOND*5, this.blink, this);
  },
  moveDude: function(){
    var xbutton = false;
    var ybutton = false;
    var xoomph = this.dude.body.acceleration.x > 0 == this.dude.body.velocity.x > 0 ? 1 : 4;
    var yoomph = this.dude.body.acceleration.y > 0 == this.dude.body.velocity.y > 0 ? 1 : 4;
    if(this.controls.left.isDown){
      this.dude.body.acceleration.x = -1 * (ACCELERATION) * xoomph;
      this.dude.body.velocity.x = this.dude.body.velocity.x === 0 ? -(INIT_BUMP) : this.dude.body.velocity.x;
      xbutton = true;
    }
    if(this.controls.right.isDown){
      this.dude.body.acceleration.x = (ACCELERATION) * xoomph;
      this.dude.body.velocity.x = this.dude.body.velocity.x === 0 ? INIT_BUMP : this.dude.body.velocity.x;
      xbutton = true;
    }
    if(this.controls.up.isDown){
      this.dude.body.acceleration.y = -1 * (ACCELERATION) * yoomph;
      this.dude.body.velocity.y = this.dude.body.velocity.y === 0 ? -(INIT_BUMP) : this.dude.body.velocity.y;
      ybutton = true;
    }
    if(this.controls.down.isDown){
      this.dude.body.acceleration.y = (ACCELERATION) * yoomph;
      this.dude.body.velocity.y = this.dude.body.velocity.y === 0 ? INIT_BUMP : this.dude.body.velocity.y;
      ybutton = true;
    }
    //decay speed if the button is let go.
    this.decayX(xbutton);
    this.decayY(ybutton);
    //keep speed between 0 and MAX_SPEED
    this.clampSpeed();
  },
  // TODO: This only works in the negative direction?
  clampSpeed: function(){
    var x = Math.min(MAX_SPEED, this.dude.body.velocity.x);
    x = Math.max(-(MAX_SPEED), this.dude.body.velocity.x);
    this.dude.body.velocity.x = x;
    var y = Math.min(MAX_SPEED, this.dude.body.velocity.y);
    x = Math.max(-(MAX_SPEED), this.dude.body.velocity.y);
    this.dude.body.velocity.y = y;
    console.log('vx: ', this.dude.body.velocity.x, ' vy: ', this.dude.body.velocity.y);
  },
  //TODO: This leaves .5, and -.5 somtimes... that's not good.
  decayX: function(xbutton){
    var scalarx = MAX_DECREASE * (this.dude.body.velocity.x / MAX_SPEED);
    var deltax = Math.min(MAX_DECREASE, Math.floor(Math.abs(this.dude.body.velocity.x) + scalarx));
    if(!xbutton){
      this.dude.body.acceleration.x = 0;
      if(this.dude.body.velocity.x < 0){
        this.dude.body.velocity.x += deltax;
      } else {
        this.dude.body.velocity.x -= deltax;
      }
    }
  },
  decayY: function(ybutton){
    var scalary = MAX_DECREASE * (this.dude.body.velocity.y / MAX_SPEED);
    var deltay = Math.min(MAX_DECREASE, Math.floor(Math.abs(this.dude.body.velocity.y) + scalary));
    if(!ybutton){
      this.dude.body.acceleration.y = 0;
      if(this.dude.body.velocity.y < 0){
        this.dude.body.velocity.y += deltay;
      } else {
        this.dude.body.velocity.y -= deltay;
      }
    }
  },
  placeWalls: function(){
    //place top and bottom wall
    for(var i = 1; i < Math.floor(game.width / 32) - 1; i++){
      var topWall = game.add.sprite(i*32 + 32, 0, 'wall_tile');
      topWall.angle = 90;
      topWall.animations.add('glow', [0,1,2,3,4,5], 5, true);
      topWall.animations.play('glow');
      topWall.scale.x = 0.25;
      topWall.scale.y= 0.5;
      var bottomWall = game.add.sprite(i*32, game.height, 'wall_tile');
      bottomWall.angle = 270;
      bottomWall.animations.add('glow', [0,1,2,3,4,5], 5, true);
      bottomWall.animations.play('glow');
      bottomWall.scale.x = 0.25;
      bottomWall.scale.y = 0.5;
    }
    for(i = 1; i < Math.floor(game.height / 32); i++){
      var left = game.add.sprite(0, i*32, 'wall_tile');
      left.animations.add('glow', [0,1,2,3,4,5], 5, true);
      left.animations.play('glow');
      left.scale.x = 0.25;
      left.scale.y= 0.5;
      var right = game.add.sprite(game.width, i*32 + 32, 'wall_tile');
      right.angle = 180;
      right.animations.add('glow', [0,1,2,3,4,5], 5, true);
      right.animations.play('glow');
      right.scale.x = 0.25;
      right.scale.y = 0.5;
    }
    //corners
    var corner = game.add.sprite(0, 32, 'corner');
    corner.scale.x = 0.5;
    corner.scale.y = 0.5;
    corner.angle = -90;
    corner = game.add.sprite(game.width - 32, 0, 'corner');
    corner.scale.x = 0.5;
    corner.scale.y = 0.5;
    corner = game.add.sprite(32,game.height, 'corner');
    corner.scale.x = 0.5;
    corner.scale.y = 0.5;
    corner.angle = 180;
    corner = game.add.sprite(game.width,game.height - 32, 'corner');
    corner.scale.x = 0.5;
    corner.scale.y = 0.5;
    corner.angle = 90;

  }
};
