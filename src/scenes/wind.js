var Gust = function()
{
  var self = this;

  self.strength = 100;
  self.pts = [];

  self.addPt = function(pt)
  {
    self.pts.push(pt);
  }
  self.lastPt = function()
  {
    return self.pts[self.pts.length-1];
  }

  var x; var dx;
  var y; var dy;
  var dst;
  var force;
  self.blow = function(obj)
  {
    for(var i = 0; i < self.pts.length-1; i++)
    {
      x = (self.pts[i][0]+self.pts[i+1][0])/2;
      y = (self.pts[i][1]+self.pts[i+1][1])/2;
      dx = Math.abs(x-obj.x);
      dy = Math.abs(y-obj.y);
      dst = Math.sqrt(dx*dx+dy*dy);
      force = (self.strength/100)*(1/dst);
      if(force > 0.1) force = 0.1;
      obj.delta[0] += (force * (self.pts[i+1][0]-self.pts[i][0]));
      obj.delta[1] += (force * (self.pts[i+1][1]-self.pts[i][1]));
    }
  }

  self.tick = function()
  {
    self.strength--;

    return self.strength;
  }

  self.draw = function(canv)
  {
    canv.context.strokeStyle = "#000000";
    canv.context.beginPath();
    canv.context.moveTo(self.pts[0][0],self.pts[0][1]);
    for(var i = 1; i < self.pts.length; i++)
    {
      canv.context.lineTo(self.pts[i][0],self.pts[i][1]);
    }
    canv.context.stroke();
  }
}

var Wind = function(world,x,y,w,h)
{
  var self = this;
  self.x = x;
  self.y = y;
  self.w = w;
  self.h = h;

  self.gusts = [];

  self.tick = function()
  {
    for(var i = 0; i < self.gusts.length; i++)
    {
      if(!self.gusts[i].tick())
      {
        self.gusts.splice(i,1);
        i--;
      }
    }
  }

  self.draw = function(canv)
  {
    for(var i = 0; i < self.gusts.length; i++)
      self.gusts[i].draw(canv);
  }

  self.blow = function(obj)
  {
    for(var i = 0; i < self.gusts.length; i++)
      self.gusts[i].blow(obj);
  }

  self.dragging = false;
  self.dragGust;
  self.dragStart = function(evt)
  {
    self.dragging = true;
    self.dragGust = new Gust();
    self.dragGust.addPt([evt.doX,evt.doY]);
    self.gusts.push(self.dragGust);
  }
  self.drag = function(evt)
  {
    var pt = self.dragGust.lastPt();
    var x = Math.abs(pt[0]-evt.doX);
    var y = Math.abs(pt[1]-evt.doY);
    if(x*x + y*y > 100) //10 px apart
      self.dragGust.addPt([evt.doX,evt.doY]);
  }
  self.dragFinish = function(evt)
  {
    self.dragging = false;
  }
}

