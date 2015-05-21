var GamePlayScene = function(game, stage)
{
  var self = this;

  var dragger;

  var world;

  self.ready = function()
  {
    dragger = new Dragger({source:stage.dispCanv.canvas});
    world = new World();
    world.ready(stage.dispCanv.canvas.width,stage.dispCanv.canvas.height);
    dragger.register(world.wind);
  };

  self.tick = function()
  {
    dragger.flush();
    world.tick();
  };

  self.draw = function()
  {
    world.draw(stage.drawCanv);
  };

  self.cleanup = function()
  {
  };
};

