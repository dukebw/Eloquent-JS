// A module that can convert month numbers to names and names to numbers.
(function(exports) {
  var names = ["January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"];
  
  exports.name = function(number) {
    return names[number];
  };
  exports.number = function(name) {
    return names.indexOf(name);
  };
})(this.month = {});
