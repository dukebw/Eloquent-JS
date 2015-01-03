// Extends cat hat so that the cat's hat circles around the cat.
var cat = document.querySelector("#cat");
var hat = document.querySelector("#hat");

var angle = 0, lastTime = null;
var animate = function(time) {
  if(lastTime !== null) {
    angle += (time - lastTime) * 0.001;
  }
  lastTime = time;
  var catTop = 300 + Math.sin(angle) * 20;
  var catLeft = 300 + Math.cos(angle) * 200;
  cat.style.top = catTop + "px";
  cat.style.left = catLeft + "px";
  hat.style.top = catTop + Math.sin(4*angle) * 100 + "px";
  hat.style.left = catLeft + Math.cos(4*angle) * 100 + "px";
  requestAnimationFrame(animate);
};
requestAnimationFrame(animate);
