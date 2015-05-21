var Seed = function()
{
  var self = this;
  self.x = 0;
  self.y = 0;
  self.w = 10;
  self.h = self.h;
  self.color = "#994411";

  self.delta = [0,0];

  self.vx = 0;
  self.vy = 0;
  self.height = 0;

  var SEED_STATE_COUNT = 0;
  var SEED_STATE_ON_FLOWER = SEED_STATE_COUNT; SEED_STATE_COUNT++;
  var SEED_STATE_IN_AIR    = SEED_STATE_COUNT; SEED_STATE_COUNT++;
  var SEED_STATE_ON_GROUND = SEED_STATE_COUNT; SEED_STATE_COUNT++;
  self.state = SEED_STATE_ON_FLOWER;

  self.tick = function()
  {
    switch(self.state)
    {
      case SEED_STATE_ON_FLOWER:
        if(Math.abs(self.delta[0])+Math.abs(self.delta[1]) > 0)
        {
          self.vx = self.delta[0];
          self.vy = self.delta[1];
          self.state = SEED_STATE_IN_AIR;
        }
        break;
      case SEED_STATE_IN_AIR:
        self.vx += self.delta[0]/10;
        self.vy += self.delta[1]/10;
        self.x += self.vx;
        self.y += self.vy;
        self.vx *= 0.9;
        self.vy *= 0.9;
        self.height -= 0.01;
        if(self.height <= 0)
          self.state = SEED_STATE_ON_GROUND;
        break;
      case SEED_STATE_ON_GROUND:
        break;
    }
    self.delta[0] = 0;
    self.delta[1] = 0;
  }

  self.draw = function(canv)
  {
    canv.context.strokeStyle = self.color;
    strokeCirc(canv,self.x,self.y,self.w/2);
  }
}

//'Male' repro
var Pollen = function()
{
  var self = this;

  self.x = Math.random()*10-5;
  self.y = Math.random()*10-5;
  self.w = 8;
  self.h = self.w;
  self.color = "#000000";

  self.tick = function()
  {
  }

  self.drawAtOffset = function(canv, x, y)
  {
    canv.context.strokeStyle = self.color;
    strokeCirc(canv,self.x+x,self.y+y,self.w/2);
  }
}
var Anther = function(stamen)
{
  var self = this;
  self.pollen = []; for(var i = 0; i < 4; i++) self.pollen.push(new Pollen());

  self.x = Math.random()*10-5;
  self.y = Math.random()*10-5;
  self.w = 20;
  self.h = self.w;
  self.color = "#FFFFFF";

  self.tick = function()
  {
  }

  self.drawAtOffset = function(canv, x, y)
  {
    canv.context.strokeStyle = self.color;
    strokeCirc(canv,self.x+x,self.y+y,self.w/2);
    for(var i = 0; i < self.pollen.length; i++)
      self.pollen[i].drawAtOffset(canv, self.x+x, self.y+y);
  }
}
var Stamen = function(flower)
{
  var self = this;
  self.anther = new Anther();

  self.x = Math.random()*10-5;
  self.y = Math.random()*10-5;
  self.w = 30;
  self.h = self.w;
  self.color = "#00FFFF";

  self.tick = function()
  {
  }

  self.drawAtOffset = function(canv, x, y)
  {
    canv.context.strokeStyle = self.color;
    strokeCirc(canv,self.x+x,self.y+y,self.w/2);
    self.anther.drawAtOffset(canv, self.x+x, self.y-self.h+y);
  }
}

//'Female' repro
var Ovule = function()
{
  var self = this;

  self.x = Math.random()*10-5;
  self.y = Math.random()*10-5;
  self.w = 10;
  self.h = self.w;
  self.color = "#FF00FF";

  self.tick = function()
  {
  }

  self.drawAtOffset = function(canv, x, y)
  {
    canv.context.strokeStyle = self.color;
    strokeCirc(canv,self.x+x,self.y+y,self.w/2);
  }
}
var Stigma = function(pistil)
{
  var self = this;
  self.pollen = [];
  self.pollen_life = [];

  self.x = Math.random()*10-5;
  self.y = Math.random()*10-5;
  self.w = 20;
  self.h = self.w;
  self.color = "#0000FF";

  self.tick = function()
  {
    if(!pistil.ovary.ovules.length) return;
    for(var i = 0; i < self.pollen.length; i++)
    {
      self.pollen_life[i]--;
      if(self.pollen_life[i] < 0)
      {
        var p = self.pollen[i];
        self.pollen.splice(i,1);
        self.pollen_life.splice(i,1);
        pistil.ovary.takePollen(p);
        i--;
        return; //max one seed at a time, so just stop others from even ticking
      }
    }
  }

  self.drawAtOffset = function(canv, x, y)
  {
    canv.context.strokeStyle = self.color;
    strokeCirc(canv,self.x+x,self.y+y,self.w/2);
    for(var i = 0; i < self.pollen.length; i++)
    {
      self.pollen[i].drawAtOffset(canv,
        self.x+((self.pollen_life[i]/100)*(pistil.ovary.x-self.x))+x,
        self.y+((self.pollen_life[i]/100)*(pistil.ovary.y-self.y))+y
      );
    }
  }
}
var Ovary = function(pistil)
{
  var self = this;
  self.ovules = []; for(var i = 0; i < 4; i++) self.ovules.push(new Ovule());

  self.x = Math.random()*10-5;
  self.y = Math.random()*10-5;
  self.w = 30;
  self.h = self.w;
  self.color = "#FFFF00";

  self.takePollen = function(p)
  {
    self.ovules.splice(self.ovules.length-1,1);
    pistil.genSeed();
  }

  self.tick = function()
  {
  }

  self.drawAtOffset = function(canv, x, y)
  {
    canv.context.strokeStyle = self.color;
    strokeCirc(canv,self.x+x,self.y+y,self.w/2);
    for(var i = 0; i < self.ovules.length; i++)
      self.ovules[i].drawAtOffset(canv, self.x+x, self.y+y);
  }
}
var Pistil = function(flower)
{
  var self = this;
  self.ovary = new Ovary(self);
  self.stigma = new Stigma(self);

  self.x = Math.random()*10-5;
  self.y = Math.random()*10-5;
  self.w = 40;
  self.h = self.w;
  self.color = "#00FF00";

  self.genSeed = function()
  {
    var s = new Seed();
    s.x = flower.x+Math.random()*10-5;
    s.y = flower.y+Math.random()*10-5;
    flower.seeds.push(s);
  }

  self.tick = function()
  {
    self.ovary.tick();
    self.stigma.tick();
  }

  self.drawAtOffset = function(canv, x, y)
  {
    canv.context.strokeStyle = self.color;
    strokeCirc(canv,self.x+x,self.y+y,self.w/2);

    self.ovary.drawAtOffset(canv, self.x+x, self.y+(self.h/2)+y);
    self.stigma.drawAtOffset(canv, self.x+x, self.y-(self.h/2)+y);
  }
}

var Flower = function(world)
{
  var self = this;
  self.pistil = new Pistil(self);
  self.stamen = new Stamen(self);

  self.x = 100;
  self.y = 100;
  self.w = 50;
  self.h = self.w;
  self.color = "#FF0000";

  self.delta = [0,0];

  self.sugar = 0;
  self.sunlight = 0;
  self.seeds = [];

  self.tick = function()
  {
    self.pistil.tick();
    self.stamen.tick();
    if(Math.abs(self.delta[0])+Math.abs(self.delta[1]) > 2) //some arbitrarily big gust
    {
      for(var i = 0; i < self.seeds.length; i++)
      {
        self.seeds[i].delta[0] = self.delta[0];
        self.seeds[i].delta[1] = self.delta[1];
        self.seeds[i].height = 5;
        world.seeds.push(self.seeds[i]);
        self.seeds.splice(i,1);
        i--;
      }
    }
    for(var i = 0; i < self.seeds.length; i++)
      self.seeds[i].tick();
    self.delta[0] = 0;
    self.delta[1] = 0;
  }

  self.draw = function(canv)
  {
    canv.context.strokeStyle = self.color;
    strokeCirc(canv,self.x,self.y,self.w/2);
    self.pistil.drawAtOffset(canv,self.x,self.y);
    self.stamen.drawAtOffset(canv,self.x,self.y);
    for(var i = 0; i < self.seeds.length; i++)
      self.seeds[i].draw(canv);
  }

  self.gambleForPollen = function()
  {
    if(self.stamen.anther.pollen.length)
    {
      if(Math.random() > 0.95)
      {
        var p = self.stamen.anther.pollen[self.stamen.anther.pollen.length-1];
        self.stamen.anther.pollen.splice(self.stamen.anther.pollen.length-1,1);
        return p;
      }
    }
    return 0;
  }
  self.takePollen = function(p)
  {
    self.pistil.stigma.pollen.push(p);
    self.pistil.stigma.pollen_life.push(100);
  }
}

