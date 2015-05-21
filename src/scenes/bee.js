var Bee = function(world)
{
  var self = this;

  self.x = 100;
  self.y = 100;
  self.w = 6;
  self.h = self.w;

  self.delta = [0,0];

  self.sugar = 0;
  self.pollen = [];
  self.target_flower;
  self.target_hive;

  var BEE_STATE_COUNT = 0;
  var BEE_STATE_IDLE             = BEE_STATE_COUNT; BEE_STATE_COUNT++;
  var BEE_STATE_TARGETING_FLOWER = BEE_STATE_COUNT; BEE_STATE_COUNT++;
  var BEE_STATE_EATING           = BEE_STATE_COUNT; BEE_STATE_COUNT++;
  var BEE_STATE_TARGETING_HIVE   = BEE_STATE_COUNT; BEE_STATE_COUNT++;
  var BEE_STATE_SLEEPING         = BEE_STATE_COUNT; BEE_STATE_COUNT++;
  self.state = BEE_STATE_IDLE;

  self.jiggle = function()
  {
    var r = Math.floor(Math.random()*4)
    switch(r)
    {
      case 0: self.x++; break;
      case 1: self.x--; break;
      case 2: self.y++; break;
      case 3: self.y--; break;
      default: break;
    }
  }

  self.blown = function()
  {
    self.x += self.delta[0];
    self.y += self.delta[1];
  }

  var dx;
  var dy;
  var l;
  self.buzzTo = function(target)
  {
    dx = target.x - self.x;
    dy = target.y - self.y;
    l = Math.sqrt(dx*dx+dy*dy);
    dx /= l;
    dy /= l;
    self.x += dx;
    self.y += dy;
  }

  self.tick = function()
  {
    switch(self.state)
    {
      case BEE_STATE_IDLE:
        self.sugar-=0.01;
        self.jiggle();
        self.blown();
        if(self.sugar <= 20)
        {
          self.state = BEE_STATE_TARGETING_FLOWER;
          self.target_flower = world.flowerNearest(self);
        }
        break;
      case BEE_STATE_TARGETING_FLOWER:
        self.sugar-=0.01;
        self.buzzTo(self.target_flower);
        self.jiggle();
        self.blown();
        break;
      case BEE_STATE_EATING:
        self.sugar-=0.01;
        self.sugar++;
        self.target_flower.sugar--;
        break;
      case BEE_STATE_TARGETING_HIVE:
        self.sugar-=0.01;
        self.buzzTo(self.target_hive);
        self.jiggle();
        self.blown();
        break;
      case BEE_STATE_SLEEPING:
        self.sugar-=0.01;
        break;
      default: break;
    }
    self.delta[0] = 0;
    self.delta[1] = 0;
  }

  self.draw = function(canv)
  {
    canv.context.strokeStyle = "#666600";
    strokeCirc(canv,self.x,self.y,self.w/2);
  }
}

var Hive = function(world)
{
  var self = this;

  self.x = 200;
  self.y = 100;
  self.w = 50;
  self.h = 50;

  self.tick = function()
  {

  }

  self.draw = function(canv)
  {
    canv.context.strokeStyle = "#444400";
    strokeRect(canv,self.x,self.y,self.w,self.h);
  }
}

