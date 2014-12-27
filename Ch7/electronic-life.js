// Electronic life (Eloquent JavaScript Ch. 7)

// Array of strings that lays out the world's grid.
var plan = ["############################",
            "#      #    #      o      ##",
            "#                          #",
            "#          #####           #",
            "##         #   #    ##     #",
            "###           ##     #     #",
            "#           ###      #     #",
            "#   ####                   #",
            "#   ##       o             #",
            "# o  #         o       ### #",
            "#    #                     #",
            "############################"];

var Vector = function(x, y) {
  this.x = x;
  this.y = y;
};
Vector.prototype.plus = function(other) {
  return new Vector(this.x + other.x, this.y + other.y);
};

// Define Grid object.
var Grid = function(width, height) {
  this.space = new Array(width * height);
  this.width = width;
  this.height = height;
};
Grid.prototype.isInside = function(vector) {
  return vector.x >= 0 && vector.x < this.width && 
    vector.y >=0 && vector.y < this.height;
};
Grid.prototype.get = function(vector) {
  return this.space[vector.x + this.width*vector.y];
};
Grid.prototype.set = function(vector, value) {
  this.space[vector.x + this.width*vector.y] = value;
};

// Map from direction names to coordinate offsets.
var directions = {
  "n": new Vector(0, -1),
  "ne": new Vector(1, -1),
  "e": new Vector(1, 0),
  "se": new Vector(1, 1),
  "s": new Vector(0, 1),
  "sw": new Vector(-1, 1),
  "w": new Vector(-1, 0),
  "nw": new Vector(-1, -1)
};

// Picks random element from array.
var randomElement = function(array) {
  return array[Math.floor(Math.random() * array.length)];
};

var directionNames = "n ne e se s sw w nw".split(" ");

var BouncingCritter = function() {
  this.direction = randomElement(directionNames);
};
BouncingCritter.prototype.act = function(view) {
  if(view.look(this.direction) != " ") {
    this.direction = view.find(" ") || "s";
  }
  return { type: "move", direction: this.direction };
};

// Legend tells us what each character in the map means -- space === null.
var elementFromChar = function(legend, ch) {
  if(ch === " ") {
    return null;
  }
  var element = new legend[ch]();
  element.originChar = ch;
  return element;
};

var charFromElement = function(element) {
  if(element === null) {
    return " ";
  }
  else {
    return element.originChar;
  }
};

// World object type takes a plan and legend as arguments.
var World = function(map, legend) {
  var grid = new Grid(map[0].length, map.length);
  this.grid = grid;
  this.legend = legend;

  map.forEach(function(line, y) {
    for(var x=0; x<line.length; ++x) {
      grid.set(new Vector(x, y), elementFromChar(legend, line[x]));
    }
  });
};
World.prototype.toString = function() {
  var output = "";
  for(var y=0; y<this.grid.height; ++y) {
    for(var x=0; x<this.grid.width; ++x) {
      var element = this.grid.get(new Vector(x, y));
      output += charFromElement(element);
    }
    output += "\n";
  }
  return output;
};

// Wall is a simple object -- takes up space only and has no act method.
var Wall = function() {};

var world = new World(plan, { "#": Wall, "o": BouncingCritter });
