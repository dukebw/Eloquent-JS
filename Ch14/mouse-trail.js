// Implementation of a mouse trail.
// Mouse trail elements
var trailElems = [], index = 0, dot;

var createElement = function() {
  var result = document.createElement("div");
  result.className = "trail";
  document.body.appendChild(result);
  trailElems.push(result);
  return result;
};

addEventListener("mousemove", function(event) {
  var dot;
  if(trailElems.length < 10) {
    dot = createElement();
  }
  else {
    dot = trailElems[index];
  }
  dot.style.left = (event.pageX - 4) + "px";
  dot.style.top = (event.pageY - 4) + "px";
  index = (index + 1) % trailElems.length;
});
