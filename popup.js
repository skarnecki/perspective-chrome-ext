document.addEventListener('DOMContentLoaded', function() {
    getCurrentTab(function(Tab) {
        fetchReferrer(Tab, function (Tab, referrer) {
            console.log(referrer)
            visit({url: Tab.url, title: Tab.title, referrer: referrer});
        });
    })
});

function getCurrentTab(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {
        var tab = tabs[0];
        if (tab.incognito == false) {
            callback(tab);
        }
    });
}

var fetchReferrer = function(Tab, callback) {
    chrome.tabs.executeScript(
        Tab.id,
        {code: 'document.referrer;'},
        function (result) {
            chrome.storage.sync.get(result[0], function (items) {
                    if (items[result] != null) {
                        callback(Tab, result[0]);
                    }
                }
            );
        });
};

var visit = function(Tab) {
    chrome.storage.sync.get('perspective:user', function (items) {
        var data = {
            'url': Tab.url,
            'title': Tab.title,
            'referrer': Tab.referrer,
            'user': items['perspective:user'],
            'time': 1
        };
        callService(data);
    });
};

var callService = function (data) {
    $.ajax({
        url: 'https://perspectivve.herokuapp.com/api/v1/entries',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),
        success: function() {
            console.log('posted' + data);
        },
        error: function(err) {
            console.log('try again');
        }
    });
};