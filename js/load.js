var Proto0 = Proto0 || {};
Proto0.Load = function(game){
  this.levelsJson = 'assets/levels/levels.json';
};

Proto0.Load.prototype = {
  preload: function(){
    game.load.json('levels', this.levelsJson);
  },
  create: function(){},
  update: function(){
    game.state.start('play');
  }
};
