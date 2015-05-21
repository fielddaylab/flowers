var GamePlayScene = function(game, stage)
{
  var self = this;

  var dragger;

  var World = function()
  {
    var self = this;

    self.flowers = [];
    self.bees = [];
    self.hives = [];
    self.wind;

    self.ready = function()
    {
      self.flowers.push(new Flower(self));
      for(var i = 0; i < 100; i++) self.bees.push(new Bee(self));
      self.hives.push(new Hive(self));
      self.wind = new Wind(self,0,0,stage.dispCanv.canvas.width,stage.dispCanv.canvas.height);
    };

    self.tick = function()
    {
      self.wind.tick();
      for(var i = 0; i < self.flowers.length; i++) self.wind.blow(self.flowers[i]);
      for(var i = 0; i < self.bees.length;    i++) self.wind.blow(self.bees[i]);

      for(var i = 0; i < self.hives.length;   i++) self.hives[i].tick();
      for(var i = 0; i < self.flowers.length; i++) self.flowers[i].tick();
      for(var i = 0; i < self.bees.length;    i++) self.bees[i].tick();
    };

    self.draw = function(canv)
    {
      self.wind.draw(canv);
      for(var i = 0; i < self.hives.length;   i++) self.hives[i].draw(canv);
      for(var i = 0; i < self.flowers.length; i++) self.flowers[i].draw(canv);
      for(var i = 0; i < self.bees.length;    i++) self.bees[i].draw(canv);
    };
  };

  var world;

  self.ready = function()
  {
    dragger = new Dragger({source:stage.dispCanv.canvas});
    world = new World();
    world.ready();
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

