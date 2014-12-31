// Converts Egg source code to JavaScript source code.
var parse = require('../egg/parser.js');

// Types: value, word and apply.
// Apply: special forms or fun
// Takes Egg program as string as input.
var generateJs = function(eggProgram) {
  var eggSyntaxTree = parse(eggProgram);

  // For "apply" type nodes.
  // TODO(brendan): add tab levels for pretty-printing?
  var translateFun = function(funNode) {
    switch(funNode.operator.name) {
      case "if":
        if(funNode.args.length !== 3) {
          throw new SyntaxError("Bad number of args to if");
        }
        return "if(" + printNode(funNode.args[0]) + ") {\n" + 
          printNode(funNode.args[1]) + "\n}\n" + 
          "else {\n" + printNode(funNode.args[2]) + "\n}\n";
    }
  };

  var printNode = function(syntaxTree) {
    switch(syntaxTree.type) {
      case "apply":
        return translateFun(syntaxTree);
      case "word":
        return syntaxTree.name;
      case "value":
        return String(syntaxTree.value);
      default:
        error("Bad type");
    }
  };

  return printNode(eggSyntaxTree);
};
