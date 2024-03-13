document.getElementById('mindmap-btn').addEventListener('click', function() {
    chrome.runtime.sendMessage({action: "getHistory"}, function(response) {
        chrome.tabs.create({url: "mindmap.html"}, function(tab) {
            // 将历史记录数据存储在本地存储中，以便mindmap.html可以访问
            chrome.storage.local.set({todayHistory: response.history}, function() {
                console.log("历史记录已保存到本地存储。");
            });
        });
    });
});
