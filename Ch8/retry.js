var MultiplicatorUnitFailure = function() {};

var primitiveMultiply = function(a, b) {
  if(Math.random() < 0.5) {
    return a*b;
  }
  else {
    throw new MultiplicatorUnitFailure();
  }
};

// A function that wraps a primiteMultiply function, which throws an exception.
// The wrapper keeps trying until a call succeeds.
var reliableMultiply = function(a, b) {
  try {
    return primitiveMultiply(a, b);
  } catch(e) {
    if(e instanceof MultiplicatorUnitFailure) {
      return reliableMultiply(a, b);
    }
    else {
      throw e;
    }
  }
};
