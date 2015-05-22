var Bee = function(world,x,y)
{
  var self = this;

  self.x = x;
  self.y = y;
  self.w = 6;
  self.h = self.w;

  self.blow_x = 0;
  self.blow_y = 0;
  self.lightness = 0.5+Math.random();

  self.sugar = 0;
  self.pollen = [];
  self.target_flower;
  self.target_hive;
  self.known_flowers = [];
  self.known_hives = [];
  self.blacklist_flowers = [];
  self.blacklist_flowers_life = [];
  self.blacklist_hives = [];
  self.blacklist_hives_life = [];

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

  self.blow = function(x,y)
  {
    self.blow_x += x;
    self.blow_y += y;
  }
  self.blown = function()
  {
    self.x += self.blow_x*self.lightness;
    self.y += self.blow_y*self.lightness;
  }

  var dx;
  var dy;
  var l;
  self.distTo = function(target)
  {
    dx = target.x - self.x;
    dy = target.y - self.y;
    return dx*dx+dy*dy;
  }
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

  var p;
  self.doTheDirtyDance = function()
  {
    if(self.pollen.length && Math.random() > 0.5)
    {
      p = self.pollen[self.pollen.length-1];
      self.pollen.splice(self.pollen.length-1,1);
      self.target_flower.takePollen(p);
    }
    if(p = self.target_flower.gambleForPollen())
      self.pollen.push(p);
  }

  self.blacklistFlower = function(flower)
  {
    self.blacklist_flowers.push(flower);
    self.blacklist_flowers_life.push(1000);
  }
  self.blacklistHive = function(hive)
  {
    self.blacklist_hives.push(hive);
    self.blacklist_hives_life.push(100);
  }

  var found;
  self.mergeToList = function(list,obj)
  {
    found = false;
    for(var i = 0; i < list.length; i++)
      if(list[i] == obj) found = true;
    if(!found) list.push(obj);
  }

  self.tick = function()
  {
    for(var i = 0; i < self.blacklist_flowers.length; i++)
    {
      self.blacklist_flowers_life[i]--;
      if(self.blacklist_flowers_life[i] <= 0)
      {
        self.blacklist_flowers.splice(i,1);
        self.blacklist_flowers_life.splice(i,1);
        i--;
      }
    }

    for(var i = 0; i < self.blacklist_hives.length; i++)
    {
      self.blacklist_hives_life[i]--;
      if(self.blacklist_hives_life[i] <= 0)
      {
        self.blacklist_hives.splice(i,1);
        self.blacklist_hives_life.splice(i,1);
        i--;
      }
    }

    self.sugar-=0.01;
    switch(self.state)
    {
      case BEE_STATE_IDLE:
        self.jiggle();
        self.blown();
        if(self.sugar <= 20)
        {
          self.target_flower = world.flowerNearest(self,self.known_flowers,self.blacklist_flowers,40);
          self.mergeToList(self.known_flowers,self.target_flower);
          if(self.target_flower) self.state = BEE_STATE_TARGETING_FLOWER;
        }
        break;
      case BEE_STATE_TARGETING_FLOWER:
        self.buzzTo(self.target_flower);
        self.jiggle();
        self.blown();
        if(self.distTo(self.target_flower) < 25)
        {
          self.x = self.target_flower.x;
          self.y = self.target_flower.y;
          self.state = BEE_STATE_EATING;
        }
        break;
      case BEE_STATE_EATING:
        if(self.target_flower.sugar > 0)
        {
          self.sugar++;
          self.target_flower.sugar--;
          if(self.sugar >= 100)
          {
            self.state = BEE_STATE_IDLE;
            self.doTheDirtyDance();
          }
        }
        else
        {
          self.blacklistFlower(self.target_flower);
          self.state = BEE_STATE_IDLE;
          self.doTheDirtyDance();
        }
        break;
      case BEE_STATE_TARGETING_HIVE:
        self.buzzTo(self.target_hive);
        self.jiggle();
        self.blown();
        break;
      case BEE_STATE_SLEEPING:
        break;
      default: break;
    }
    self.blow_x = 0;
    self.blow_y = 0;
    if(self.sugar < 0) self.sugar = 0;
  }

  self.draw = function(canv)
  {
    canv.context.strokeStyle = "#666600";
    strokeCirc(canv,self.x,self.y,self.w/2);
    for(var i = 0; i < self.pollen.length; i++)
      self.pollen[i].drawAtOffset(canv,self.x,self.y);
  }
}

var Hive = function(world,x,y)
{
  var self = this;

  self.x = x;
  self.y = y;
  self.w = 80;
  self.h = self.w;

  self.sugar = 1000;
  self.lastgen = 0;

  self.shouldGenBee = function()
  {
    if(self.sugar >= 50 && self.lastgen <= 0)
    {
      self.sugar -= 50;
      self.lastgen = 10;
      return true;
    }
    return false;
  }

  self.tick = function()
  {
    self.lastgen--;
  }

  self.draw = function(canv)
  {
    canv.context.strokeStyle = "#444400";
    strokeCirc(canv,self.x,self.y,self.w/2);
  }
}

