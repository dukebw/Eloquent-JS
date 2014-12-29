(function(exports) {
  exports.BouncingCritter = function() {
    this.direction = randomElement(directionNames);
  };

  exports.BouncingCritter.prototype.act = function(view) {
    if(view.look(this.direction) != " ") {
      this.direction = view.find(" ") || "s";
    }
    return { type: "move", direction: this.direction };
  };

  exports.WallFollower = function() {
    this.dir = "s";
  };

  exports.WallFollower.prototype.act = function(view) {
    var start = this.dir;
    if(view.look(dirPlus(this.dir, -3)) !== " ") {
      start = this.dir = dirPlus(this.dir, -2);
    }
    while(view.look(this.dir) != " ") {
      this.dir = dirPlus(this.dir, 1);
      if(this.dir === start) {
        break;
      }
    }
    return { type: "move", 
             direction: this.dir };
  };
  exports.Plant = function() {
    this.energy = 3 + Math.random() * 4;
  };

  exports.Plant.prototype.act = function(context) {
    if(this.energy > 15) {
      var space = context.find(" ");
      if(space) {
        return { type: "reproduce", direction: space };
      }
    }
    if(this.energy < 20) {
      return { type: "grow" };
    }
  };

  exports.PlantEater = function() {
    this.energy = 20;
  };

  PlantEater.prototype.act = function(context) {
    var space = context.find(" ");
    if(this.energy > 60 && space) {
      return { type: "reproduce", direction: space };
    }
    var plant = context.find("*");
    if(plant) {
      return { type: "eat", direction: plant };
    }
    if(space) {
      return { type: "move", direction: space };
    }
  };

  // Exercises
  // Artificial stupidity.
  // A new critter type that tries to address the greediness of PlantEater,
  // and make the critters' movement less random.
  exports.SmartPlantEater = function() {
    this.energy = 30;
    this.direction = "e";
  };

  exports.SmartPlantEater.prototype.act = function(context) {
    var space = context.find(" ");
    if(this.energy > 90 && space) {
      return { type: "reproduce", direction: space };
    }
    var plants = context.findAll("*");
    if(plants.length >= 1) {
      return { type: "eat", direction: randomElement(plants) };
    }
    if(context.look(this.direction) !== " " && space) {
      this.direction = space;
    }
    return { type: "move", direction: this.direction };
  };

  // Predators.
  // Implement critters that eat herbivores.
  exports.Tiger = function() {
    this.energy = 100;
    this.direction = "e";
    this.preySeen = [];
  };

  exports.Tiger.prototype.act = function(context) {
    // Average number of prey seen per turn
    var seenPerTurn = this.preySeen.reduce(function(a, b) {
      return a + b;
    }, 0) / this.preySeen.length;
    var prey = context.findAll("O");
    this.preySeen.push(prey.length);
    // Drop the first element from the array when it is longer than 6.
    if(this.preySeen.length > 6) {
      this.preySeen.shift();
    }

    // Only eat if the predator saw more than ¼ prey animal per turn.
    if(prey.length && seenPerTurn > 0.25) {
      return { type: "eat", direction: randomElement(prey) };
    }

    var space = context.find(" ");
    if(this.energy > 400 && space) {
      return { type: "reproduce", direction: space};
    }
    if(context.look(this.direction) !== " " && space) {
      this.direction = space;
    }
    return { type: "move", direction: this.direction };
  };
})(this.critters = {});
