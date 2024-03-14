document.getElementById('mindmap-btn').addEventListener('click', function() {
    browser.runtime.sendMessage({action: "getHistory"}).then(function(response) {
        browser.tabs.create({url: "mindmap.html"}).then(function(tab) {
            // 将历史记录数据存储在本地存储中，以便mindmap.html可以访问
            browser.storage.local.set({todayHistory: response.history}).then(function() {
                console.log("历史记录已保存到本地存储。");
            });
        });
    });
});
