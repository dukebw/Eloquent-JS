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
    var children = node.childNodes, tabs = [], button;

    for(var i = 0; i < node.childNodes.length; ++i) {
      var child = node.childNodes[i];
      if(child.nodeType === document.ELEMENT_NODE) {
        tabs.push(child);
      }
    }

    var tabList = document.createElement("div");
    tabs.forEach(function(tab, i) {
      var button = document.createElement("button");
      button.textContent = tab.getAttribute("data-tabname");
      button.addEventListener("click", function() { selectTab(i); });
      tabList.appendChild(button);
    });
    node.insertBefore(tabList, node.firstChild);

    var selectTab = function(n) {
      tabs.forEach(function(tab, i) {
        if(i === n) {
          tab.style.display = "";
        }
        else {
          tab.style.display = "none";
        }
      });
      for(i = 0; i < tabList.childNodes.length; ++i) {
        if(i === n) {
          tabList.childNodes[i].style.background = "violet";
        }
        else {
          tabList.childNodes[i].style.background = "";
        }
      }
    };
    selectTab(0);
  }
  else {
    // TODO(brendan): log error
    console.log("No children");
  }
};

asTabs(document.querySelector("#wrapper"));
