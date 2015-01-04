// Implementation of a mouse trail.
// Mouse trail elements
var trailElems = [], index = 0, lastTime = null, dot;

// Update a pair of variables that track the mouse position.
var cursorPos = {
  x: 0,
  y: 0
};

var animate = function(time) {
  var factor = 0.05, dot, cursorX, cursorY, dotX, dotY;
  if(lastTime !== null) {
    // (time - lastTime) ?
  }

  for(var i = 0; i < trailElems.length; ++i) {
    dot = trailElems[i];
    cursorX = parseFloat(cursorPos.x);
    cursorY = parseFloat(cursorPos.y);
    dotX = parseFloat(dot.style.left);
    dotY = parseFloat(dot.style.top);
    console.log(factor);
    dot.style.left = (dotX + 
                      (cursorX - dotX) * factor * Math.sqrt(i + 1)) + "px";
    dot.style.top = (dotY + 
                     (cursorY - dotY) * factor * Math.sqrt(i + 1)) + "px";
  }

  requestAnimationFrame(animate);
};

var createElements = function(event) {
  var dot;
  for(var i = 0; i < 10; ++i) {
    dot = document.createElement("div");
    dot.className = "trail";
    dot.style.left = (event.pageX - 4) + "px";
    dot.style.top = (event.pageY - 4) + "px";
    document.body.appendChild(dot);
    trailElems.push(dot);
  }
  // create trail only once.
  removeEventListener("mousemove", createElements);
};

addEventListener("mousemove", createElements);

// Simulate trailing elements being attracted to the position of the mouse
// pointer.
addEventListener("mousemove", function(event) {
  cursorPos.x = (event.pageX - 4) + "px";
  cursorPos.y = (event.pageY - 4) + "px";
});

requestAnimationFrame(animate);
