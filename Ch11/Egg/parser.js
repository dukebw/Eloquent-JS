// Everything in Egg is an expression.
// Expression -> variable, number, string or application.
// Takes string as input. 
// Returns expression data structure for start of string and leftover string.
exports.parse = function(program) {
  var result = parseExpression(program);
  if(skipSpace(result.rest).length > 0) {
    throw new SyntaxError("Unexpected text after program");
  }
  return result.expr;
};

var parseExpression = function(program) {
  program = skipSpace(program);
  var match, expr;
  // Strings
  if((match = /^"([^"]*)"/.exec(program))) {
    expr = { type: "value", value: match[1] };
  }
  // Numbers
  else if((match = /^\d+\b/.exec(program))) {
    expr = { type: "value", value: Number(match[0]) };
  }
  // Words
  else if((match = /^[^\s(),"]+/.exec(program))) {
    expr = { type: "word", value: match[0] };
  }
  else {
    throw new SyntaxError("Unexpected syntax: " + program);
  }
  return parseApply(expr, program.slice(match[0].length));
};

var skipSpace = function(string) {
  var first = string.search(/\S/);
  if(first === -1) {
    return "";
  }
  return string.slice(first);
};

// Checks whether expr is application. If so, parses arguments.
var parseApply = function(expr, program) {
  program = skipSpace(program);
  if(program[0] !== "(") {
    return { expr: expr, rest: program };
  }
  program = skipSpace(program.slice(1));
  expr = { type: "apply", operator: expr, args: [] }; 
  while(program[0] !== ")") {
    var arg = parseExpression(program);
    expr.args.push(arg.expr);
    program = skipSpace(arg.rest);
    if(program[0] === ",") {
      program = skipSpace(program.slice(1));
    }
    else if(program[0] != ")") {
      throw new SyntaxError("Expected ',' or ')'");
    }
  }
  return parseApply(expr, program.slice(1));
};
