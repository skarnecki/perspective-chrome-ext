var init = function(tabId, ChangeState, Tab) {
  if (ChangeState.status == "complete" && shouldTabBeVisited(Tab)) {
    visit(Tab);
  }
};

var shouldTabBeVisited = function(Tab) {
  if (Tab.incognito == false) {
    return true;
  }
};

var visit = function(Tab) {
  var data = {
    "url": Tab.url,
    "title": Tab.title,
    "time": 1,
    "user": "das3ad-3dasdas"
  };
  callService(data);
};

var callService = function (data) {
  $.ajax({
    url: 'https://perspectivve.herokuapp.com/api/v1/entries',
    type: 'post',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(data),
    success: function() {
      console.log("posted" + data);
    },
    error: function(err) {
      console.log("try again");
    }
  });
};

chrome.tabs.onUpdated.addListener(init);