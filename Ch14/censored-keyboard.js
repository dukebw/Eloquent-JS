// A text field into which the letters Q, W and X cannot be typed.
var field = document.querySelector("input");
field.addEventListener("keypress", function(event) {
  if(/[qwx]/i.test(String.fromCharCode(event.charCode))) {
    event.preventDefault();
  }
});
