// contrived object
var box = {
  locked: true,
  unlock: function() { this.locked = false; },
  lock: function() { this.locked = true; },
  _content: [],
  get content() {
    if(this.locked) {
      throw new Error("Locked!");
    }
    return this._content;
  }
};

// Takes a function value as an argument, unlocks the box, runs the function,
// and then locks the box again before returning (regardless of exceptions).
var withBoxUnlocked = function(body) {
  var locked = box.locked;
  if(!locked) {
    return body();
  }

  box.unlock();
  try {
    body();
  } finally {
    box.lock();
  }
};

withBoxUnlocked(function() {
  box.content.push("gold piece");
});

try {
  withBoxUnlocked(function() {
    throw new Error("Pirates on the horizon! Abort!");
  });
} catch(e) {
  console.log("Error raised: ", e);
}

// true
console.log(box.locked);
