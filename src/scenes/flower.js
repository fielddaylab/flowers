//'Male' repro
var Pollen = function()
{
  var self = this;

  self.x = Math.random()*10-5;
  self.y = Math.random()*10-5;
  self.w = 8;
  self.h = self.w;
  self.color = "#000000";

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

  self.x = Math.random()*10-5;
  self.y = Math.random()*10-5;
  self.w = 20;
  self.h = self.w;
  self.color = "#0000FF";

  self.drawAtOffset = function(canv, x, y)
  {
    canv.context.strokeStyle = self.color;
    strokeCirc(canv,self.x+x,self.y+y,self.w/2);
    for(var i = 0; i < self.pollen.length; i++)
      self.pollen[i].drawAtOffset(canv, self.x+x, self.y+y);
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
  self.ovary = new Ovary();
  self.stigma = new Stigma();

  self.x = Math.random()*10-5;
  self.y = Math.random()*10-5;
  self.w = 40;
  self.h = self.w;
  self.color = "#00FF00";

  self.drawAtOffset = function(canv, x, y)
  {
    canv.context.strokeStyle = self.color;
    strokeCirc(canv,self.x+x,self.y+y,self.w/2);

    self.ovary.drawAtOffset(canv, self.x+x, self.y+(self.h/2)+y);
    self.stigma.drawAtOffset(canv, self.x+x, self.y-(self.h/2)+y);
  }
}

var Flower = function()
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

  self.tick = function()
  {

  }

  self.draw = function(canv)
  {
    canv.context.strokeStyle = self.color;
    strokeCirc(canv,self.x,self.y,self.w/2);
    self.pistil.drawAtOffset(canv,self.x,self.y);
    self.stamen.drawAtOffset(canv,self.x,self.y);
  }
}

