var GamePlayScene = function(game, stage)
{
  var self = this;

  var flower = new Flower();

  self.ready = function()
  {
  };

  self.tick = function()
  {
  };

  self.draw = function()
  {
    flower.draw(stage.drawCanv);
  };

  self.cleanup = function()
  {
  };

};

