var GamePlayScene = function(game, stage)
{
  var self = this;

  var dragger;

  var flowers = [];
  var bees = [];
  var hives = [];
  var wind;

  self.ready = function()
  {
    dragger = new Dragger({source:stage.dispCanv.canvas});

    flowers.push(new Flower());
    for(var i = 0; i < 100; i++) bees.push(new Bee());
    hives.push(new Hive());
    wind = new Wind(0,0,stage.dispCanv.canvas.width,stage.dispCanv.canvas.height);
    dragger.register(wind);
  };

  self.tick = function()
  {
    dragger.flush();
    wind.tick();
    for(var i = 0; i < hives.length;   i++) hives[i].tick();
    for(var i = 0; i < flowers.length; i++) flowers[i].tick();
    for(var i = 0; i < bees.length;    i++) bees[i].tick();
  };

  self.draw = function()
  {
    wind.draw(stage.drawCanv);
    for(var i = 0; i < hives.length;   i++) hives[i].draw(stage.drawCanv);
    for(var i = 0; i < flowers.length; i++) flowers[i].draw(stage.drawCanv);
    for(var i = 0; i < bees.length;    i++) bees[i].draw(stage.drawCanv);
  };

  self.cleanup = function()
  {
  };
};

