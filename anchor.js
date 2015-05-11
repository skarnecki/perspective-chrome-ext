document.addEventListener('DOMContentLoaded', function() {
    getCurrentTab(function(Tab) {
        chrome.storage.sync.get(Tab.url, function (items) {
            if (items[Tab.url] != null) {
                $("#remove-from-whitelist").removeClass('hidden');
                $("#add-to-whitelist").addClass('hidden');
            }
        });
    });

    chrome.storage.sync.get('perspective:user', function (items) {
        if (items['perspective:user'] == null) {
            var userId = Math.random() + "";
            chrome.storage.sync.set({'perspective:user': userId});
        }
    });
});

var getCurrentTab = function(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {
        var tab = tabs[0];
        var url = tab.url;
        console.assert(typeof url == 'string', 'tab.url should be a string');
        callback(tab);
    });
};

$("#remove-from-whitelist").click(function() {
    getCurrentTab(function(Tab) {
        whitelistRemove(Tab.url);
        $("#remove-from-whitelist").addClass('hidden');
        $("#add-to-whitelist").removeClass('hidden');
    });
});

$("#add-to-whitelist").click(function() {
    getCurrentTab(function(Tab) {
        whitelistAdd(Tab.url);
        $("#remove-from-whitelist").removeClass('hidden');
        $("#add-to-whitelist").addClass('hidden');
    });
});

var whitelistAdd = function(url) {
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

var whitelistRemove = function(url) {
    chrome.storage.sync.remove(url);
};

$('#my-perspective').click(function() {
    chrome.storage.sync.get('perspective:user', function (items) {
        if (items['perspective:user'] != null) {
            chrome.tabs.create({'url': 'https://perspectivve.herokuapp.com/users/' + items['perspective:user'], 'active': true});
        }
    });
});
