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
document.getElementById('console-log').addEventListener('click', () => {
  // 获取所有窗口
  browser.windows.getAll({populate: true}).then(windows => {
    windows.forEach(win => {
      // 打印窗口ID
      console.log(`Window ID: ${win.id}`);
      // 打印窗口下所有标签页的ID
      win.tabs.forEach(tab => {
        console.log(`Tab ID: ${tab.id}`);
      });
    });
  }).catch(error => {
    console.error(`Error fetching windows: ${error}`);
  });
});
