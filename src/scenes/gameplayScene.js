var GamePlayScene = function(game, stage)
{
  var self = this;

  var flowers = [];
  var bees = [];
  var hives = [];
  var wind = [];

  self.ready = function()
  {
    flowers.push(new Flower());
    for(var i = 0; i < 100; i++) bees.push(new Bee());
    hives.push(new Hive());
  };

  self.tick = function()
  {
    for(var i = 0; i < hives.length;   i++) hives[i].tick();
    for(var i = 0; i < flowers.length; i++) flowers[i].tick();
    for(var i = 0; i < bees.length;    i++) bees[i].tick();
    for(var i = 0; i < wind.length;    i++) wind[i].tick();
  };

  self.draw = function()
  {
    for(var i = 0; i < hives.length;   i++) hives[i].draw(stage.drawCanv);
    for(var i = 0; i < flowers.length; i++) flowers[i].draw(stage.drawCanv);
    for(var i = 0; i < bees.length;    i++) bees[i].draw(stage.drawCanv);
    for(var i = 0; i < wind.length;    i++) wind[i].draw(stage.drawCanv);
  };

  self.cleanup = function()
  {
  };
};

