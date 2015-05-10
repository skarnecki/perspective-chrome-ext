
function getCurrentTabUrl(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {
        var tab = tabs[0];
        var url = tab.url;
        console.assert(typeof url == 'string', 'tab.url should be a string');
        callback(url);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('loaded');

});

document.getElementById("add-to-blacklist").onclick = function() {
    getCurrentTabUrl(function(url) {
        blacklist(url);
    });
};

var blacklist = function(url) {
    chrome.storage.sync.get(url, function (items) {
        if (items[url] == null) {
            var data = {};
            data[url] = true;
            chrome.storage.sync.set(data, function() {
                // Notify that we saved.
                console.log('Settings saved');
            });
        }
    });
};
