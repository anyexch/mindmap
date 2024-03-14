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

