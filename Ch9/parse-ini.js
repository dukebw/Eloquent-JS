var parseINI = function(string) {
  // Start with an object to hold the top-level fields
  var currentSection = { name: null, fields: [] };
  var categories = [currentSection];
  string.split(/\r?\n/).forEach(function(line) {
    var match;
    if(/^\s*(;.*)?$/.test(line)) {
      return;
    }
    else if(line.match(/^\[(.*)\]$/)) {
      match = line.match(/^\[(.*)\]$/);
      currentSection = { name: match[1], fields: []};
      categories.push(currentSection);
    }
    else if(line.match(/^(\w+)=(.*)$/)) {
      match = line.match(/^(\w+)=(.*)$/);
      currentSection.fields.push({ name: match[1],
                                   value: match[2] });
    }
    else {
      throw new Error("Line '" + line + "' is invalid.");
    }
  });
  return categories;
};

// Uses Node Filesystem
var parseIniFile = function(filename) {
  return parseINI(fs.readFileSync(filename, 'utf8'));
};
