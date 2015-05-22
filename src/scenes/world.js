var Sun = function(world)
{
  var self = this;
  self.shine = 0;

  self.t = 0;
  self.tick = function()
  {
    self.t += 0.01;
    self.shine = (Math.sin(self.t)+1)/2;
  }
}

var World = function()
{
  var self = this;

  self.flowers = [];
  self.bees = [];
  self.hives = [];
  self.seeds = [];
  self.wind;
  self.sun;

  self.ready = function(w, h)
  {
    self.flowers.push(new Flower(self,100,100));
    self.hives.push(new Hive(self,300,150));
    self.wind = new Wind(self,0,0,w,h);
    self.sun = new Sun(self);
  };

  self.tick = function()
  {
    self.sun.tick();
    self.wind.tick();
    for(var i = 0; i < self.flowers.length; i++) self.wind.blow(self.flowers[i]);
    for(var i = 0; i < self.bees.length;    i++) self.wind.blow(self.bees[i]);
    for(var i = 0; i < self.seeds.length;   i++) self.wind.blow(self.seeds[i]);

    for(var i = 0; i < self.hives.length;   i++) self.hives[i].tick();
    for(var i = 0; i < self.flowers.length; i++) self.flowers[i].tick();
    for(var i = 0; i < self.bees.length;    i++) self.bees[i].tick();
    for(var i = 0; i < self.seeds.length;   i++) self.seeds[i].tick();

    for(var i = 0; i < self.seeds.length; i++)
    {
      if(self.seeds[i].shouldBecomeFlower())
      {
        self.flowers.push(new Flower(self,self.seeds[i].x,self.seeds[i].y));
        self.seeds.splice(i,1);
        i--;
      }
    }
    for(var i = 0; i < self.hives.length; i++)
    {
      while(self.hives[i].shouldGenBee())
        self.bees.push(new Bee(self,self.hives[i],self.hives[i].x,self.hives[i].y));
    }
  };

  self.draw = function(canv)
  {
    self.wind.draw(canv);
    for(var i = 0; i < self.hives.length;   i++) self.hives[i].draw(canv);
    for(var i = 0; i < self.flowers.length; i++) self.flowers[i].draw(canv);
    for(var i = 0; i < self.bees.length;    i++) self.bees[i].draw(canv);
    for(var i = 0; i < self.seeds.length;   i++) self.seeds[i].draw(canv);
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
  self.thingnearest = function(obj,things,known,blacklist,los)
  {
    best = 99999999999;
    besti = -1;
    for(var i = 0; i < things.length; i++)
    {
      ok = true;
      tmpdst = dstsqrdbtwn(obj,things[i]);
      if(tmpdst > los*los)
      {
        ok = false;
        for(var j = 0; j < known.length; j++)
          if(known[j] == things[i]) ok = true;
      }
      if(ok && tmpdst < best)
      {
        ok = true;
        for(var j = 0; j < blacklist.length; j++)
          if(things[i] == blacklist[j]) ok = false;
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
  self.hiveNearest = function(obj,known,blacklist,los)
  {
    return self.thingnearest(obj,self.hives,known,blacklist,los);
  }
  self.flowerNearest = function(obj,known,blacklist,los)
  {
    return self.thingnearest(obj,self.flowers,known,blacklist,los);
  }
  self.beeNearest = function(obj,known,blacklist,los)
  {
    return self.thingnearest(obj,self.bees,known,blacklist,los);
  }
};

