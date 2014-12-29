(function(exports) {
  // Array of strings that lays out the world's grid.
  exports.plan = ["############################",
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

// Define Grid object.
  exports.Grid = function(width, height) {
    this.space = new Array(width * height);
    this.width = width;
    this.height = height;
  };

  exports.Grid.prototype.isInside = function(vector) {
    return vector.x >= 0 && vector.x < this.width && 
      vector.y >=0 && vector.y < this.height;
  };

  exports.Grid.prototype.get = function(vector) {
    return this.space[vector.x + this.width*vector.y];
  };

  exports.Grid.prototype.set = function(vector, value) {
    this.space[vector.x + this.width*vector.y] = value;
  };

  // Calls a given function for each element in the grid that isn't null or
  // undefined, suppoting a context parameter.
  exports.Grid.prototype.forEach = function(f, context) {
    for(var y=0; y<this.height; ++y) {
      for(var x=0; x<this.width; ++x) {
        var value = this.space[x + y*this.width];
        if(value !== null) {
          f.call(value, context, new Vector(x, y));
        }
      }
    }
  };
  // World object type takes a plan and legend as arguments.
  exports.World = function(map, legend) {
    var grid = new Grid(map[0].length, map.length);
    this.grid = grid;
    this.legend = legend;

    map.forEach(function(line, y) {
      for(var x=0; x<line.length; ++x) {
        grid.set(new Vector(x, y), elementFromChar(legend, line[x]));
      }
    });
  };

  exports.World.prototype.toString = function() {
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

  // Gives the critters a chance to act.
  exports.World.prototype.turn = function() {
    var acted = [];
    this.grid.forEach(function(critter, vector) {
      if(critter.act && acted.indexOf(critter) === -1) {
        acted.push(critter);
        this.letAct(critter, vector);
      }
    }, this);
  };

  // Contains the logic that allows critters to move.
  exports.World.prototype.letAct = function(critter, vector) {
    var action = critter.act(new View(this, vector));
    if(action && action.type === "move") {
      var dest = this.checkDestination(action, vector);
      if(dest && this.grid.get(dest) === null) {
        this.grid.set(vector, null);
        this.grid.set(dest, critter);
      }
    }
  };

  exports.World.prototype.checkDestination = function(action, vector) {
    if(directions.hasOwnProperty(action.direction)) {
      var dest = vector.plus(directions[action.direction]);
      if(this.grid.isInside(dest)) {
        return dest;
      }
    }
  };

  // The so-far missing View type.
  exports.View = function(World, vector) {
    this.world = world;
    this.vector = vector;
  };

  exports.View.prototype.look = function(dir) {
    var target = this.vector.plus(directions[dir]);
    if(this.world.grid.isInside(target)) {
      return charFromElement(this.world.get(target));
    }
    else {
      return "#";
    }
  };

  exports.View.prototype.findAll = function(ch) {
    var found = [];
    for(var dir in directions) {
      if(this.look(dir) === ch) {
        found.push(dir);
      }
    }
    return found;
  };

  exports.View.prototype.find = function(ch) {
    var found = this.findAll(ch);
    if(found.length === 0) {
      return null;
    }
    return randomElement(found);
  };

  // Wall is a simple object -- takes up space only and has no act method.
  exports.Wall = function() {};

  exports.world = new World(plan, { "#": Wall, "o": BouncingCritter });
  // A world supporting plants that overrides the letAct method of World.
  exports.LifelikeWorld = function(map, legend) {
    World.call(this, map, legend);
  };

  exports.LifelikeWorld.prototype = Object.create(World.prototype);

  exports.LifelikeWorld.prototype.letAct = function(critter, vector) {
    var action = critter.act(new View(this, vector));
    var handled = action && action.type in actionTypes &&
      actionTypes[action.type].call(this, critter, vector, action);
    if(!handled) {
      critter.energy -= 0.2;
      if(critter.energy <= 0) {
        this.grid.set(vector, null);
      }
    }
  };
})(this.world = {});
