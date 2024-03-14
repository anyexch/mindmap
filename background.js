chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "openMindMap") {
    chrome.tabs.create({url: "mindmap.html"});
  }
});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getHistory") {
        var midnight = new Date();
        midnight.setHours(0, 0, 0, 0);
        chrome.history.search({
            'text': '', // 空字符串返回所有历史记录
            'startTime': midnight.getTime()
        }, function(historyItems) {
            sendResponse({history: historyItems});
        });4 
        return true; // 保持消息通道开放
    }
});

// 在 background.js 中
let tabsTree = {}; // 用于存储标签树的对象

browser.tabs.onCreated.addListener(newTab => {
    browser.tabs.query({currentWindow: true, active: true}).then(tabs => {
        let parentTabId = tabs[0].id;
        if (!tabsTree[parentTabId]) {
            tabsTree[parentTabId] = { children: [] };
        }
        tabsTree[parentTabId].children.push({id: newTab.id, url: newTab.url || 'about:newtab', children: []});
        
        // 更新 tabsTree 后立即保存到 browser.storage.local
        browser.storage.local.set({tabsTree: tabsTree});
    });
});


