// Define a walk_the_DOM function that visits every node of the tree
// in HTML source order, invoking a function on each node.
var walk_the_DOM = function walk(node, func) {
  func(node);
  node = node.firstChild;
  while(node) {
    walk(node, func);
    node = node.nextSibling;
  }
};

var byTagName = function(node, tagName) {
  var elementsByTagName = [];

  var addElement = function(node, tagName) {
    if(node.tagName && String.toLowerCase(node.tagName) === tagName) {
      elementsByTagName.push(node);
    }
  };

  walk_the_DOM(node, function(node) {
    addElement(node, tagName);
  });
  return elementsByTagName;
};

// 1
console.log(byTagName(document.body, "h1").length);
// 3
console.log(byTagName(document.body, "span").length);
var para = document.querySelector("p");
console.log(byTagName(para, "span").length);
