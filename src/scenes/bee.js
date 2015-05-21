var Bee = function()
{
  var self = this;

  self.x = 100;
  self.y = 100;
  self.w = 6;
  self.h = self.w;

  self.tick = function()
  {
    var x = Math.floor(Math.random()*4)
    switch(x)
    {
      case 0: self.x++; break;
      case 1: self.x--; break;
      case 2: self.y++; break;
      case 3: self.y--; break;
      default: break;
    }
  }

  self.draw = function(canv)
  {
    canv.context.strokeStyle = "#666600";
    strokeCirc(canv,self.x,self.y,self.w/2);
  }
}

var Hive = function()
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

