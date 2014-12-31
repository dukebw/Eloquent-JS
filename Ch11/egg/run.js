var parse = require('./parser.js');
var evaluate = require('./evaluator.js');

// Environment object to represent the global scope
var topEnv = Object.create(null);
topEnv["true"] = true;
topEnv["false"] = false;

// Define operators in a loop to keep code short
["+", "-", "*", "/", "==", "<", ">"].forEach(function(op) {
  topEnv[op] = new Function("a, b", "return a " + op + " b;");
});

topEnv.print = function(value) {
  console.log(value);
  return value;
};

var run = function() {
  var env = Object.create(topEnv);
  var program = Array.prototype.slice.call(arguments, 0).join("\n");
  return evaluate(parse(program), env);
};

module.exports = run;
