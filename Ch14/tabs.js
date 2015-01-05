// Implementation of a simple tabbed interface
// Takes a DOM node and shows its child elements as tabs.
// NOTE(brendan): non-active tab given a display style of none (hidden)
var findButton = function(text) {
  var buttons = document.getElementsByTagName("button");
  for(var i = 0; i < buttons.length; ++i) {
    if(buttons[i].textContent === text) {
      return buttons[i];
    }
  }
};

var asTabs = function(node) {
  if(node.hasChildNodes) {
    var children = node.childNodes;
    var button;

    var showTab = function(event) {
      var divs = document.getElementsByTagName("div");
      for(var i = 0; i < divs.length; ++i) {
        var tabname = divs[i].getAttribute("data-tabname");
        if(tabname) {
          if(tabname === event.target.textContent) {
            divs[i].style.display = ""; 
            findButton(tabname).style.color = "red";
          }
          else {
            divs[i].style.display = "none";
            findButton(tabname).style.color = "black";
          }
        }
      }
    };

    for(var i = 0; i < children.length; ++i) {
      if(children[i].style) {
        children[i].style.display = "none";
        button = document.createElement("button");
        button.textContent = children[i].getAttribute("data-tabname");
        button.style.left = node.style.left;
        button.style.top = node.style.top;
        document.body.appendChild(button);
      }
    }

    addEventListener("click", showTab);
  }
  else {
    // TODO(brendan): log error
    console.log("No children");
  }
};

asTabs(document.querySelector("#wrapper"));
