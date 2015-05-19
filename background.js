chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, Tab) {
    if (changeInfo.status == 'complete') {
        fetchReferrer(Tab, function (Tab, referrer) {
            visit({url: Tab.url, title: Tab.title, referrer: referrer});
        });
    }
});

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