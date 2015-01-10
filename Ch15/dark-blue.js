// Eloquent JS Ch15
// Dark Blue (A Platform Game)
var simpleLevelPlan = [
  "                      ",
  "                      ",
  "  x              = x  ",
  "  x         o o    x  ",
  "  x @      xxxxx   x  ",
  "  xxxxx            x  ",
  "      x!!!!!!!!!!!!x  ",
  "      xxxxxxxxxxxxxx  ",
  "                      "
];

var scale = 20;
var maxStep = 0.05;
var wobbleSpeed = 8, wobbleDist = 0.07;
var playerXSpeed = 7;
var gravity = 30;
var jumpSpeed = 17;
var arrowCodes = { 37: "left", 38: "up", 39: "right"};

var trackKeys = function(codes) {
  var pressed = Object.create(null);
  var handler = function(event) {
    if(codes.hasOwnProperty(event.keyCode)) {
      var down = (event.type === "keydown");
      pressed[codes[event.keyCode]] = down;
      event.preventDefault();
    }
  };
  addEventListener("keydown", handler);
  addEventListener("keyup", handler);
  return pressed;
};

var Vector = function(x, y) {
  this.x = x;
  this.y = y;
};

Vector.prototype.plus = function(other) {
  return new Vector(this.x + other.x, this.y + other.y);
};

Vector.prototype.times = function(factor) {
  return new Vector(this.x * factor, this.y * factor);
};

var Player = function(pos) {
  this.pos = pos.plus(new Vector(0, -0.5));
  this.size = new Vector(0.8, 1.5);
  this.speed = new Vector(0, 0);
};

Player.prototype.type = "player";

Player.prototype.moveX = function(step, level, keys) {
  this.speed.x = 0;
  if(keys.left) {
    this.speed.x -= playerXSpeed;
  }
  if(keys.right) {
    this.speed.x += playerXSpeed;
  }

  var motion = new Vetor(this.speed.x * step, 0);
  var newPos = this.pos.plus(motion);
  var obstacle = level.obstacleAt(newPos, this.size);
  if(obstacle) {
    level.playerTouched(obstacle);
  }
  else {
    this.pos = newPos;
  }
};

Player.prototype.moveY = function(step, level, keys) {
  this.speed.y += step * gravity;
  var motion = new Vector(0, this.speed.y * step);
  var newPos = this.pos.plus(motion);
  var obstacle = level.obstacleAt(newPos, this.size);
  if(obstacle) {
    level.playerTouched(obstacle);
    if(keys.up && this.speed.y > 0) {
      this.speed.y = -jumpSpeed;
    }
    else {
      this.speed.y = 0;
    }
  }
  else {
    this.pos = newPos;
  }
};

Player.prototype.act = function(step, level, keys) {
  this.moveX(step, level, keys);
  this.moveY(step, level, keys);

  var otherActor = level.actorAt(this);
  if(otherActor) {
    level.playerTouched(otherActor.type, otherActor);
  }

  // Losing animation
  if(level.status == "lost") {
    this.pos.y += step;
    this.size.y -= step;
  }
};

// NOTE(brendan): Coin constructor
var Coin = function(pos) {
  this.basePos = this.pos = pos.plus(new Vector(0.2, 0.1));
  this.size = new Vector(0.6, 0.6);
  this.wobble = Math.random() * Math.PI * 2;
};

Coin.prototype.type = "coin";

Coin.prototype.act = function(act) {
  this.wobble += step * wobbleSpeed;
  var wobblePos = Math.sin(this.wobble) * wobbleDist;
  this.pos = this.basePos.plus(new Vector(0, wobblePos));
};

// NOTE(brendan): Lava constructor
var Lava = function(pos, ch) {
  this.pos = pos;
  this.size = new Vector(1, 1);
  if(ch === "=") {
    this.speed = new Vector(2, 0);
  }
  else if(ch === "|") {
    this.speed = new Vector(0, 2);
  }
  else if(ch === "v") {
    this.speed = new Vector(0, 3);
    this.repeatPos = pos;
  }
};

Lava.prototype.type = "lava";

Lava.prototype.act = function(step, level) {
  var newPos = this.pos.plus(this.speed.times(step));
  if(!level.obstacleAt(newPos, this.size)) {
    this.pos = newPos;
  }
  else if(this.repeatPos) {
    this.pos = this.repeatPos
  }
  else {
    this.speed = this.speed.times(-1);
  }
};

// NOTE(brendan): Used by Level object to associate characters with
// constructor functions.
var actorChars = {
  "@": Player,
  "o": Coin,
  "=": Lava, "|": Lava, "v": Lava
};

// NOTE(brendan): creates an element and gives it a class
var elt = function(name, className) {
  var elt = document.createElement(name);
  if(className) {
    elt.className = className;
  }
  return elt;
};

var DOMDisplay = function(parent, level) {
  this.wrap = parent.appendChild(elt("div", "game"));
  this.level = level;

  this.wrap.appendChild(this.drawBackground());
  this.actorLayer = null;
  this.drawFrame();
};

DOMDisplay.prototype.drawBackground = function() {
  var table = elt("table", "background");
  table.style.width = this.level.width * scale + "px";
  this.level.grid.forEach(function(row) {
    var rowElt = table.appendChild(elt("tr"));
    rowElt.style.height = scale + "px";
    row.forEach(function(type) {
      rowElt.appendChild(elt("td", type));
    });
  });
  return table;
};

DOMDisplay.prototype.drawActors = function() {
  var wrap = elt("div");
  this.level.actors.forEach(function(actor) {
    var rect = wrap.appendChild(elt("div", "actor " + actor.type));
    rect.style.width = actor.size.x * scale + "px";
    rect.style.height = actor.size.y * scale + "px";
    rect.style.left = actor.pos.x * scale + "px";
    rect.style.top = actor.pos.y * scale + "px";
  });
  return wrap;
};

DOMDisplay.prototype.drawFrame = function() {
  if(this.actorLayer) {
    this.wrap.removeChild(this.actorLayer);
  }
  this.actorLayer = this.wrap.appendChild(this.drawActors());
  this.wrap.className = "game " + (this.level.status || "");
  this.scrollPlayerIntoView();
};

// NOTE(brendan): Find player's position and update wrapping element's scroll
// position.
DOMDisplay.prototype.scrollPlayerIntoView = function() {
  var width = this.wrap.clientWidth;
  var height = this.wrap.clientHeight;
  var margin = width / 3;

  // NOTE(brendan): the viewport
  var left = this.wrap.scrollLeft, right = left + width;
  var top = this.wrap.scrollTop, bottom = top + height;

  var player = this.level.player;
  var center = player.pos.plus(player.size.times(0.5)).times(scale);

  if(center.x < left + margin) {
    this.wrap.scrollLeft = center.x - margin;
  }
  else if(center.x > right - margin) {
    this.wrap.scrollLeft = center.x + margin - width;
  }
  if(center.y < top + margin) {
    this.wrap.scrollTop = center.y - margin;
  }
  else if(center.y > bottom - margin) {
    this.wrap.scrollTop = center.y + margin - height;
  }
};

DOMDisplay.prototype.clear = function() {
  this.wrap.parentNode.removeChild(this.wrap); 
};

// NOTE(brendan): Level constructor
var Level = function(plan) {
  this.width = plan[0].length;
  this.height = plan.length;
  this.grid = [];
  this.actors = [];

  for(var y = 0; y < this.height; ++y) {
    var line = plan[y], gridLine = [];
    for(var x = 0; x < this.width; ++x) {
      var ch = line[x], fieldType = null;
      var Actor = actorChars[ch];
      if(Actor) {
        this.actors.push(new Actor(new Vector(x, y), ch));
      }
      else if(ch === "x") {
        fieldType = "wall";
      }
      else if(ch === "!") {
        fieldType = "lava";
      }
      gridLine.push(fieldType);
    }
    this.grid.push(gridLine);
  }

  this.player = this.actors.filter(function(actor) {
    return actor.type === "player";
  })[0];
  this.status = this.finishDelay = null;
};

Level.prototype.isFinished = function() {
  return this.status !== null && this.finishDelay < 0;
};

// NOTE(brendan): tells us whether a rectangle overlaps with any non-empty
// space on the background grid.
Level.prototype.obstacleAt = function(pos, size) {
  var xStart = Math.floor(pos.x);
  var xEnd = Math.floor(pos.x + size.x);
  var yStart = Math.floor(pos.y);
  var yEnd = Math.floor(pos.y + size.y);

  if(xStart < 0 || xEnd > this.width || yStart < 0) {
    return "wall";
  }
  if(yEnd > this.height) {
    return "lava";
  }
  for(var y = yStart; y < yEnd; ++y) {
    for(var x = xStart; x < xEnd; ++x) {
      var fieldType = this.grid[y][x];
      if(fieldType) {
        return fieldType;
      }
    }
  }
};

// NOTE(brendan): Scans array of actors, looking for an actor that overlaps
// the actor given as an argument.
Level.prototype.actorAt = function(actor) {
  for(var i = 0; i < this.actors.length; ++i) {
    var other = this.actors[i];
    if(other !== actor &&
       actor.pos.x + actor.size.x > other.pos.x &&
       actor.pos.x < other.pos.x + other.size.x &&
       actor.pos.y + actor.size.y > other.pos.y &&
       actor.pos.y < other.pos.y + other.size.y) {
      return other;
    }
  }
};

Level.prototype.animate = function(step, keys) {
  if(this.status !== null) {
    this.finishDelay -= step;
  }

  while(step > 0) {
    var thisStep = Math.min(step, maxStep);
    this.actors.forEach(function(actor) {
      actor.act(thisStep, this, keys);
    }, this);
    step -= thisStep;
  }
};

Level.prototype.playerTouched = function(type, actor) {
  if(type === "lava" && this.status === null) {
    this.status = "lost";
    this.finishDelay = 1;
  }
  else if(type === "coin") {
    this.actors = this.actors.filter(function(other) {
      return other !== actor;
    });
    if(!this.actors.some(function(actor) {
      return actor.type === "coin";
    })) {
      this.status = "won";
      this.finishDelay = 1;
    }
  }
};

var simpleLevel = new Level(simpleLevelPlan);
var display = new DOMDisplay(document.body, simpleLevel);
