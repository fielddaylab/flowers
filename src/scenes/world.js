var World = function()
{
  var self = this;

  self.flowers = [];
  self.bees = [];
  self.hives = [];
  self.wind;

  self.ready = function(w, h)
  {
    self.flowers.push(new Flower(self));
    for(var i = 0; i < 100; i++) self.bees.push(new Bee(self));
    self.hives.push(new Hive(self));
    self.wind = new Wind(self,0,0,w,h);
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

  var x;
  var y;
  var dstsqrdbtwn = function(a,b)
  {
    x = Math.abs(a.x-b.x);
    y = Math.abs(a.y-b.y);
    return x*x+y*y;
  }
  var tmpdst;
  var best;
  var besti;
  var ok;
  self.thingnearest = function(obj,things,blacklist)
  {
    best = 99999999999;
    besti = -1;
    for(var i = 0; i < things.length; i++)
    {
      tmpdst = dstsqrdbtwn(obj,things[i]);
      if(tmpdst < best)
      {
        ok = true;
        for(var j = 0; j < blacklist.length; j++)
        {
          if(things[i] == blacklist[j]) ok = false;
        }
        if(ok)
        {
          best = tmpdst;
          besti = i;
        }
      }
    }
    if(besti >= 0) return things[besti];
    else           return 0;
  }
  self.hiveNearest = function(obj,blacklist)
  {
    return self.thingnearest(obj,self.hives,blacklist);
  }
  self.flowerNearest = function(obj,blacklist)
  {
    return self.thingnearest(obj,self.flowers,blacklist);
  }
  self.beeNearest = function(obj,blacklist)
  {
    return self.thingnearest(obj,self.bees,blacklist);
  }
};

