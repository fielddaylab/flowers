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

var Tuft = function(cloud, x, y, w, h)
{
  var self = this;

  self.x = x;
  self.y = y;
  self.w = w;
  self.h = h;

  self.vx = 0;
  self.vy = 0;
  self.blow_x = 0;
  self.blow_y = 0;

  self.blow = function(x,y)
  {
    self.blow_x += x;
    self.blow_y += y;
  }

  self.tick = function()
  {
    self.vx += self.blow_x;
    self.vy += self.blow_y;
    self.vx *= 0.99;
    self.vy *= 0.99;
    self.x += self.vx;
    self.y += self.vy;

    self.blow_x = 0;
    self.blow_y = 0;
  }

  self.draw = function(canv)
  {
    canv.context.strokeStyle = "rgba(255,255,255,0.2)";
    canv.context.fillStyle = "rgba(255,255,255,0.2)";
    strokeCirc(canv, self.x, self.y, self.w/2);
    canv.context.fill();
  }
}
var Cloud = function(world, x, y, w, h)
{
  var self = this;

  self.x = x;
  self.y = y;
  self.w = w;
  self.h = h;

  self.tufts = [];

  for(var i = 0; i < 50; i++)
    self.tufts.push(new Tuft(world, self.x+(Math.random()*self.w), self.y+(Math.random()*self.h), self.w/2, self.h/2));

  self.blow = function(x,y)
  {
    x /= 100;
    y /= 100;
    for(var i = 0; i < self.tufts.length; i++)
      self.tufts[i].blow(x,y);
  }

  self.tick = function()
  {
    for(var i = 0; i < self.tufts.length; i++)
      self.tufts[i].tick();
  }

  self.draw = function(canv)
  {
    for(var i = 0; i < self.tufts.length; i++)
      self.tufts[i].draw(canv);
  }
}

var Grass = function(world, x, y)
{
  var self = this;

  self.x = x;
  self.y = y;

  self.ex = ((Math.random()*2)-1)*5+self.x
  self.ey = self.y-10-Math.random()*5;

  self.b_x = 0;
  self.b_y = 0;
  self.blow_x = 0;
  self.blow_y = 0;

  self.blow = function(x,y)
  {
    x /= 3;
    y /= 3;
    self.blow_x += x;
    self.blow_y += y;
  }

  self.tick = function()
  {
    self.b_x += self.blow_x;
    self.b_y += self.blow_y;
    self.b_x *= 0.9;
    self.b_y *= 0.9;
    self.blow_x = 0;
    self.blow_y = 0;
  }

  self.draw = function(canv)
  {
    canv.context.strokeStyle = "#AAFFAA";
    strokeLine(canv,self.x,self.y,self.ex+self.b_x,self.ey+self.b_y);
  }
}

var World = function()
{
  var self = this;

  self.flowers = [];
  self.bees = [];
  self.hives = [];
  self.seeds = [];
  self.grass = [];
  self.clouds = [];
  self.wind;
  self.sun;

  self.ready = function(w, h)
  {
    self.flowers.push(new Flower(self,100,100)); self.flowers[0].freebee = true;
    self.hives.push(new Hive(self,300,150));
    self.wind = new Wind(self,0,0,w,h);
    self.sun = new Sun(self);
    for(var i = 0; i < 1000; i++) self.grass.push(new Grass(self,Math.random()*w,Math.random()*h));
    self.clouds.push(new Cloud(self, 100,100,150,50));
  };

  self.tick = function()
  {
    self.sun.tick();
    self.wind.tick();
    for(var i = 0; i < self.flowers.length; i++) self.wind.blow(self.flowers[i]);
    for(var i = 0; i < self.bees.length;    i++) self.wind.blow(self.bees[i]);
    for(var i = 0; i < self.seeds.length;   i++) self.wind.blow(self.seeds[i]);
    for(var i = 0; i < self.grass.length;   i++) self.wind.blow(self.grass[i]);
    for(var i = 0; i < self.clouds.length;  i++) self.wind.blow(self.clouds[i]);

    for(var i = 0; i < self.hives.length;   i++) self.hives[i].tick();
    for(var i = 0; i < self.flowers.length; i++) self.flowers[i].tick();
    for(var i = 0; i < self.bees.length;    i++) self.bees[i].tick();
    for(var i = 0; i < self.seeds.length;   i++) self.seeds[i].tick();
    for(var i = 0; i < self.grass.length;   i++) self.grass[i].tick();
    for(var i = 0; i < self.clouds.length;  i++) self.clouds[i].tick();

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
    canv.context.fillStyle = "#AAEEAA";
    canv.context.fillRect(0,0,canv.canvas.width,canv.canvas.height);
    for(var i = 0; i < self.grass.length;   i++) self.grass[i].draw(canv);
    for(var i = 0; i < self.hives.length;   i++) self.hives[i].draw(canv);
    for(var i = 0; i < self.flowers.length; i++) self.flowers[i].draw(canv);
    for(var i = 0; i < self.bees.length;    i++) self.bees[i].draw(canv);
    for(var i = 0; i < self.seeds.length;   i++) self.seeds[i].draw(canv);
    for(var i = 0; i < self.clouds.length;  i++) self.clouds[i].draw(canv);
    self.wind.draw(canv);
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

