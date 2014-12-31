// Exports at bottom
// Evaluates syntax tree of an Egg program
var evaluate = function(expr, env) {
  switch(expr.type) {
    case "value":
      return expr.value;
    case "word":
      if(expr.name in env) {
        return env[expr.name];
      }
      else {
        throw new ReferenceError("Undefined variable: " + expr.name);
      }
    case "apply":
      if(expr.operator.type === "word" &&
         expr.operator.name in specialForms) {
        return specialForms[expr.operator.name](expr.args, env);
      }
      var op = evaluate(expr.operator, env);
      if(typeof op !== "function") {
        throw new TypeError("Applying a non-function.");
      }
      return op.apply(null, expr.args.map(function(arg) {
        return evaluate(arg, env);
      }));
  }
};

// Used to define special syntax in Egg
var specialForms = Object.create(null);

specialForms["if"] = function(args, env) {
  if(args.length !== 3) {
    throw new SyntaxError("Bad number of args to if");
  }
  if(evaluate(args[0], env) !== false) {
    return evaluate(args[1], env);
  }
  else {
    return evaluate(args[2], env);
  }
};

specialForms["while"] = function(args, env) {
  if(args.length !== 2) {
    throw new SyntaxError("Bad number of args to while");
  }
  while(evaluate(args[0], env) !== false) {
    evaluate(args[1], env);
  }
  return false;
};

// Executes its arguments from top to bottom.
// Its value is the value produced by the last argument
specialForms["do"] = function(args, env) {
  var value = false;
  args.forEach(function(arg) {
    value = evaluate(arg, env);
  });
  return value;
};

specialForms.define = function(args, env) {
  if(args.length !== 2 || args[0].type !== "word") {
    throw new SyntaxError("Bad use of define");
  }
  var value = evaluate(args[1], env);
  env[args[0].name] = value;
  return value;
};

specialForms.fun = function(args, env) {
  if(!args.length) {
    throw new SyntaxError("Functions need a body");
  }
  var name = function(expr) {
    if(expr.type !== "word") {
      throw new SyntaxError("Arg names must be words");
    }
    return expr.name;
  };
  var argNames = args.slice(0, args.length - 1).map(name);
  var body = args[args.length - 1];

  return function() {
    if(arguments.length !== argNames.length) {
      throw new TypeError("Wrong number of arguments");
    }
    var localEnv = Object.create(env);
    for(var i=0; i<arguments.length; ++i) {
      localEnv[argNames[i]] = arguments[i];
    }
    return evaluate(body, localEnv);
  };
};

module.exports = evaluate;
