var Proto0 = Proto0 || {};
Proto0.Play = function(game){
  this.dude = null;
  this.levelIndex = 0;
  this.levels = [];
  this.currentLevel = {};
  this.blinkCount = 0;
};

Proto0.Play.prototype = {
  preload: function(){
    this.levels = game.cache.getJSON('levels');
    for(var levelIndex in this.levels){
      game.load.json(this.levels[levelIndex], 'assets/levels/' + this.levels[levelIndex]);
    }
    game.load.spritesheet('dude', 'assets/gizmo.png', 64, 64);
  },

  create: function(){
    this.currentLevel = game.cache.getJSON(this.levels[++(this.levelIndex)]);
    game.stage.backgroundColor = '#FFF';
    this.dude = game.add.sprite(0, 0,'dude');
    this.dude.animations.add('blink', [0,1,2,3,4,5], 5, true);
    this.dude.scale.y = 0.5;
    this.dude.scale.x = 0.5;
    game.time.events.loop(Phaser.Timer.SECOND*5, this.blink, this);
  },

  update: function() {},
  
  blink: function(){
    this.dude.animations.play('blink');
    var dude = this.dude;
    setTimeout(function(dude){
      dude.animations.stop('blink');
      dude.frame = 0;
    }, 1010, dude);

  }
};
