(function(exports) {
  exports.Vector = function(x, y) {
    this.x = x;
    this.y = y;
  };

  exports.Vector.prototype.plus = function(other) {
    return new Vector(this.x + other.x, this.y + other.y);
  };

  // Map from direction names to coordinate offsets.
  exports.directions = {
    "n": new Vector(0, -1),
    "ne": new Vector(1, -1),
    "e": new Vector(1, 0),
    "se": new Vector(1, 1),
    "s": new Vector(0, 1),
    "sw": new Vector(-1, 1),
    "w": new Vector(-1, 0),
    "nw": new Vector(-1, -1)
  };

  exports.directionNames = "n ne e se s sw w nw".split(" ");

  // Picks random element from array.
  exports.randomElement = function(array) {
    return array[Math.floor(Math.random() * array.length)];
  };

  // Legend tells us what each character in the map means -- space === null.
  exports.elementFromChar = function(legend, ch) {
    if(ch === " ") {
      return null;
    }
    var element = new legend[ch]();
    element.originChar = ch;
    return element;
  };

  exports.charFromElement = function(element) {
    if(element === null) {
      return " ";
    }
    else {
      return element.originChar;
    }
  };
  // Define operations to calculate relative directions.
  exports.dirPlus = function(dir, n) {
    var index = directionNames.indexOf(dir);
    return directionNames[(index + n + 8) % 8];
  };

  exports.actionTypes = Object.create(null);

  // Used by plants.
  exports.actionTypes.grow = function(critter) {
    critter.energy += 0.5;
    return true;
  };

  exports.actionTypes.move = function(critter, vector, action) {
    var dest = this.checkDestination(action, vector);
    if(dest === null || critter.energy <= 1 || this.grid.get(dest) !== null) {
      return false;
    }
    critter.energy -= 1;
    this.grid.set(vector, null);
    this.grid.set(dest, critter);
    return true;
  };

  exports.actionTypes.eat = function(critter, vector, action) {
    var dest = this.checkDestination(action, vector);
    var atDest = dest !== null && this.grid.get(dest);
    if(!atDest || atDest.energy === null) {
      return false;
    }
    critter.energy += atDest.energy;
    this.grid.set(dest, null);
    return true;
  };

  // We allow our critters to reproduce.
  exports.actionTypes.reproduce = function(critter, vector, action) {
    var baby = elementFromChar(this.legend, critter.originChar);
    var dest = this.checkDestination(action, vector);
    if(dest === null || critter.energy <= 2*baby.energy ||
        this.grid.get(dest) !== null) {
      return false;
    }
    critter.energy -= 2 * baby.energy;
    this.grid.set(dest, baby);
    return true;
  };
})(this.logic = {});
