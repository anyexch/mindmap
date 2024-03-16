
// browser.storage.local对于信息量，有没有上限的限制呢？比如哈，我有一个思路，就是当我打开firefox 浏览器时，我给每一个标签一个对应的id就类似于docker 的id。每个标签页面当他诞生时，给予一个不同于其他标签的独立id，同时当一个新标签是由其他标签产生时，会记录一个父标签的id，这样层级关系不就有了吗？一个标签包含两个id 一个父id 一个自身id。比如当我手动建立新标签时那么父id就为空，因为我手动来的麻。这样一个完整的思维导图思路就有了，同时也可以给每一个windows 一个独立的id这样每个标签会有3个id 分别时 windows id ，父id 和自身 id。然后将些信息记录下来，当触发mindmap时，遍历所有id 即可了解到所有的层级结构了。同时还可以这样，当页面刷新时，比如我点击某个搜索页面，点击其中的一条结果，没有产生新标签而是在当前标签中，直接显示了新的结果，那么相当于页面被刷新，这种情况，可以在原有页面id的下面追加一条id，作为子id。总之当页面刷新，或者关闭这两种情况还没有太想好思路。但是我总体的思路就是完整记录下每一条tab 的关系脉络，并记录下页面的标题即地址，构成一个完整的思维导图。存储下来，方便操作。
    // 页面刷新：对于页面刷新的情况，你可以考虑在原有的标签页对象中添加一个子页面列表，用于记录这个标签页历史上打开过的所有页面。每次页面刷新时，将新页面的信息（如URL、标题等）添加到这个列表中。
    // 页面关闭：当标签页关闭时，你可以从存储中移除这个标签页的信息，或者标记这个标签页为已关闭，这取决于你想如何处理关闭的标签页数据。
// 页面刷新，将新的页面url 和标题记录到列表中，页面关闭的话，就给这个标签添加一个标记，那么，完整的思路大概就是，可以建立这样一个标签类，他的结构大概如下：包含windowid，包含父标签id，自身标签id，页面内容列表：自身页面信息url，自身页面标题（历史url，历史标题），是否已经关闭。看下这样是否ok
//uuid 生成函数
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


// 通过标签页ID获取标签页信息
function getTabInfoByTabId(tabId) {
  return new Promise((resolve, reject) => {
    browser.storage.local.get(`tab_${tabId}`, function(result) {
      resolve(result[`tab_${tabId}`]);
    });
  });
}

// 更新存储中的标签页信息
function updateTabInfoInStorage(tabId, tabInfo) {
  browser.storage.local.set({[`tab_${tabId}`]: tabInfo});
}

// class TabInfo {
  // constructor(windowId, parentId, tabId, uuid) {
    // this.windowId = windowId;
    // this.parentId = parentId;
    // this.tabId = tabId;
    // this.uuid = uuid; // 存储UUID
    // this.currentPage = { url: '', title: '' }; // 初始化为空，稍后更新
    // this.history = [];
    // this.isClosed = false;
  // }

  // addPageToHistory(url, title) {
    // this.history.push({ url: url, title: title });
  // }

  // markAsClosed() {
    // this.isClosed = true;
  // }
// }
// 类中去掉方法，简化后的类：
class TabInfo {
  constructor(windowId, parentId, tabId, uuid) {
    this.windowId = windowId;
    this.parentId = parentId;
    this.tabId = tabId;
    this.uuid = uuid; // 存储UUID
    this.currentPage = { url: '', title: '' }; // 初始化为空，稍后更新
    this.history = []; // 直接操作这个数组，而不是通过方法
    this.isClosed = false;
  }
}

//================定义类tabinfo 这个类


browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "openMindMap") {
    browser.tabs.create({url: "mindmap.html"});
  }
});
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getHistory") {
        var midnight = new Date();
        midnight.setHours(0, 0, 0, 0);
        browser.history.search({
            'text': '', // 空字符串返回所有历史记录
            'startTime': midnight.getTime()
        }, function(historyItems) {
            sendResponse({history: historyItems});
        });4 
        return true; // 保持消息通道开放
    }
});

// 在 background.js 中
/* let tabsTree = {}; // 用于存储标签树的对象

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
}); */


// 监听标签页创建事件
/* browser.tabs.onCreated.addListener(function(tab) {
  let tabId = tab.id;
  let windowId = tab.windowId;
  let uniqueTabId = generateUUID(); // 生成唯一ID

  // 创建TabInfo对象
  let tabInfo = new TabInfo(windowId, null, tabId, uniqueTabId);

  // 序列化TabInfo对象
  let tabInfoStr = JSON.stringify(tabInfo);

  // 使用UUID作为键存储TabInfo对象
  browser.storage.local.set({[`tabInfo_${uniqueTabId}`]: tabInfoStr});
}); */

// 监听标签页创建事件，不设置parentId
// 监听标签页创建事件，不覆盖已设置parentId的TabInfo对象
browser.tabs.onCreated.addListener(tab => {
  let tabId = tab.id;
  let windowId = tab.windowId;

  // 检查是否已存在TabInfo对象
  browser.storage.local.get(`tabInfo_${tabId}`).then(result => {
    if (!result[`tabInfo_${tabId}`]) {
      // 如果不存在，则创建新的TabInfo对象
      let uniqueTabId = generateUUID(); // 假设你有这个函数生成唯一ID
      let tabInfo = new TabInfo(windowId, null, tabId, uniqueTabId, '', '');

      // 序列化并存储TabInfo对象
      browser.storage.local.set({[`tabInfo_${tabId}`]: JSON.stringify(tabInfo)});
    }
    // 如果已存在，不进行任何操作，保留已有的TabInfo对象，包括其parentId
  });
});






// 监听标签页更新事件
browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    // 从storage中获取TabInfo对象
    browser.storage.local.get(null).then(result => {
      Object.keys(result).forEach(key => {
        if (key.startsWith(`tabInfo_`) && key.endsWith(`_${tabId}`)) {
          let tabInfo = JSON.parse(result[key]);
          if (tabInfo) {
            tabInfo.currentPage.url = tab.url;
            tabInfo.currentPage.title = tab.title;
            tabInfo.history.push({ url: tab.url, title: tab.title }); // 直接向 history 数组中添加新页面信息

            // 更新存储
            browser.storage.local.set({[key]: JSON.stringify(tabInfo)});
          }
        }
      });
    });
  }
});

// 监听由一个页面产生另一个页面的事件，仅在此处设置parentId
browser.webNavigation.onCreatedNavigationTarget.addListener(details => {
  let newTabId = details.tabId; // 新标签页的ID
  let sourceTabId = details.sourceTabId; // 触发新标签页打开的原标签页的ID

  console.log(`New Tab ID: ${newTabId}, Source Tab ID: ${sourceTabId}`); // 输出新标签页ID和源标签页ID

  // 尝试获取触发新标签页打开的原标签页的TabInfo
  browser.tabs.get(sourceTabId).then(sourceTab => {
    let windowId = sourceTab.windowId; // 获取原标签页所在的窗口ID

    // 尝试获取新标签页的TabInfo
    browser.storage.local.get(`tabInfo_${newTabId}`).then(result => {
      let newTabInfo;
      if (result[`tabInfo_${newTabId}`]) {
        console.log(`TabInfo for new tab ${newTabId} already exists. Updating parentId.`); // 如果新标签页的TabInfo已存在，输出日志
        newTabInfo = JSON.parse(result[`tabInfo_${newTabId}`]);
        newTabInfo.parentId = sourceTabId; // 更新parentId
      } else {
        console.log(`Creating new TabInfo for tab ${newTabId} with parentId ${sourceTabId}.`); // 如果不存在，输出日志
        let uuid = generateUUID(); // 生成唯一ID
        // 创建一个新的TabInfo对象，并设置parentId
        newTabInfo = new TabInfo(windowId, sourceTabId, newTabId, uuid);
      }

      // 存储或更新新标签页的TabInfo
      browser.storage.local.set({[`tabInfo_${newTabId}`]: JSON.stringify(newTabInfo)}).then(() => {
        console.log(`TabInfo for tab ${newTabId} stored/updated successfully.`); // 成功存储或更新后输出日志
      });
    }).catch(error => console.error(`Error processing new navigation target: ${error}`)); // 处理错误
  }).catch(error => console.error(`Error fetching source tab window ID: ${error}`)); // 处理获取原标签页窗口ID的错误
});

browser.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  // tabId 是关闭的标签页的ID
  // removeInfo 是一个对象，包含有关关闭的标签页的信息

  // 从storage中获取TabInfo对象
  browser.storage.local.get(null).then(result => {
    Object.keys(result).forEach(key => {
      if (key.startsWith(`tabInfo_`) && key.endsWith(`_${tabId}`)) {
        let tabInfo = JSON.parse(result[key]);
        if (tabInfo) {
          // 标签页已关闭，更新isClosed状态
          tabInfo.isClosed = true;

          // 更新存储
          browser.storage.local.set({[key]: JSON.stringify(tabInfo)}).then(() => {
            console.log(`Updated isClosed for tabId: ${tabId}`);
          }).catch(error => {
            console.error(`Error updating isClosed for tabId: ${tabId}: ${error}`);
          });
        }
      }
    });
  }).catch(error => {
    console.error(`Error retrieving tabInfo for tabId: ${tabId}: ${error}`);
  });
});


// 当标签页从一个窗口分离时
browser.tabs.onDetached.addListener(function(tabId, detachInfo) {
  console.log(`Tab ${tabId} was detached from window ${detachInfo.oldWindowId}`);
});

// 当标签页附加到一个窗口时
browser.tabs.onAttached.addListener(function(tabId, attachInfo) {
  console.log(`Tab ${tabId} was attached to window ${attachInfo.newWindowId}`);
});




/* // 监听标签页更新事件
browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // 检查网页是否加载完成
  if (changeInfo.status === 'complete') {
    // 从storage中获取TabInfo对象
    browser.storage.local.get(`tabInfo_${tabId}`, function(result) {
      let tabInfoStr = result[`tabInfo_${tabId}`];
      let tabInfo = JSON.parse(tabInfoStr); // 反序列化TabInfo对象

      // 如果存在TabInfo对象，则更新当前页面信息并添加到历史记录
      if (tabInfo) {
        tabInfo.currentPage = { url: tab.url, title: tab.title };
        tabInfo.addPageToHistory(tab.url, tab.title);

        // 重新序列化TabInfo对象并更新storage中的信息
        tabInfoStr = JSON.stringify(tabInfo);
        browser.storage.local.set({[`tabInfo_${tabId}`]: tabInfoStr});
      }
    });
  }
});
 */
