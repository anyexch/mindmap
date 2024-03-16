// document.addEventListener('DOMContentLoaded', function() {
    // browser.storage.local.get(['todayHistory'], function(result) {
        // var historyItems = result.todayHistory || [];
        // var list = document.createElement('ul');
        // list.style.listStyleType = 'none'; // 移除列表项前的标记
        // historyItems.forEach(function(item) {
            // var listItem = document.createElement('li');
            // var button = document.createElement('button');
            // button.innerHTML = `${item.title} - <a href='${item.url}' target='_blank'>${item.url.substring(0, 30)}...</a>`;
            // button.className = 'history-item'; // 添加类名以便CSS样式化
            // listItem.appendChild(button);
            // list.appendChild(listItem);
        // });
        // document.body.appendChild(list);
    // });
// });

/* // 在 mindmap.js 中
document.addEventListener('DOMContentLoaded', function() {
    browser.storage.local.get(['tabsTree', 'todayHistory']).then(data => {
        let tabsTree = data.tabsTree || {};
        let historyItems = data.todayHistory || [];
        
        // 构建标签树的HTML
        let container = document.createElement('div');
        function buildTreeHtml(node) {
            if (!node || !node.children) return '';
            let ul = document.createElement('ul');
            node.children.forEach(child => {
                let li = document.createElement('li');
                li.textContent = child.url; // 简化处理，只显示URL
                li.appendChild(buildTreeHtml(child)); // 递归添加子节点
                ul.appendChild(li);
            });
            return ul;
        }
        container.appendChild(buildTreeHtml(tabsTree));
        document.body.appendChild(container);
        
        // 构建今日浏览历史的HTML（保留原有逻辑）
        var list = document.createElement('ul');
        list.style.listStyleType = 'none';
        historyItems.forEach(function(item) {
            var listItem = document.createElement('li');
            var button = document.createElement('button');
            button.innerHTML = `${item.title} - <a href='${item.url}' target='_blank'>${item.url.substring(0, 30)}...</a>`;
            button.className = 'history-item';
            listItem.appendChild(button);
            list.appendChild(listItem);
        });
        document.body.appendChild(list);
    });
});
 */
/* document.addEventListener('DOMContentLoaded', function() {
    // 获取并展示历史记录
    browser.storage.local.get('todayHistory').then(data => {
        const historyItems = data.todayHistory || [];
        const historyContainer = document.getElementById('history');
        historyItems.forEach(item => {
            const div = document.createElement('div');
            div.textContent = `${item.title} - ${item.url}`;
            historyContainer.appendChild(div);
        });
    });

    // 获取并展示标签树
    browser.storage.local.get('tabsTree').then(data => {
        const tabsTree = data.tabsTree || {};
        const mapContainer = document.getElementById('mindmap');
        // 假设你有一个函数 buildTreeHtml 来构建树状HTML
        const treeHtml = buildTreeHtml(tabsTree); // 实现这个函数来构建树状结构的HTML
        mapContainer.appendChild(treeHtml);
    });
}); */

// 增加递归函数来显示 mindtree
/* function buildTreeHtml(node, depth = 0) {
    if (!node || !node.children) return null;
    const container = document.createElement('div');
    node.children.forEach(child => {
        const div = document.createElement('div');
        div.textContent = child.url; // 假设每个节点都有一个URL属性
        div.style.paddingLeft = `${depth * 20}px`; // 根据层级深度应用缩进
        div.className = 'tree-node'; // 应用样式
        container.appendChild(div);
        const childTree = buildTreeHtml(child, depth + 1); // 递归构建子树
        if (childTree) container.appendChild(childTree);
    });
    return container;
} */

// 在DOMContentLoaded事件处理器中使用buildTreeHtml函数
// document.addEventListener('DOMContentLoaded', function() {
    // browser.storage.local.get('tabsTree').then(data => {
        // const tabsTree = data.tabsTree || {};
        // const mapContainer = document.getElementById('mindmap');
        // const treeHtml = buildTreeHtml(tabsTree); // 构建标签树的HTML
        // if (treeHtml) mapContainer.appendChild(treeHtml);
    // });
// });

// document.addEventListener('DOMContentLoaded', function() {
  // browser.storage.local.get(null).then((items) => {
    // const tabsInfoContainer = document.getElementById('tabsInfoContainer');
    // Object.keys(items).forEach((key) => {
      // if (key.startsWith('tabInfo_')) {
        // const tabInfo = JSON.parse(items[key]);
        // const tabInfoElement = document.createElement('div');
        // tabInfoElement.textContent = `Window ID: ${tabInfo.windowId}, Tab ID: ${tabInfo.tabId}, UUID: ${tabInfo.uuid}, URL: ${tabInfo.currentPage.url}, Title: ${tabInfo.currentPage.title}`;
        // tabsInfoContainer.appendChild(tabInfoElement);
      // }
    // });
  // }).catch((error) => {
    // console.error('Error fetching tab info:', error);
  // });
// });
function checkTabExists(tabId) {
  return browser.tabs.get(tabId)
    .then(() => "live")
    .catch(() => "not live");
}


// document.addEventListener('DOMContentLoaded', function() {
  // browser.storage.local.get(null).then((items) => {
    // const tabsInfoContainer = document.getElementById('tabsInfoContainer');
    // Object.keys(items).forEach((key) => {
      // if (key.startsWith('tabInfo_')) {
        // const tabInfo = JSON.parse(items[key]);
        // const tabInfoElement = document.createElement('div');
        // tabInfoElement.textContent = `Window ID: ${tabInfo.windowId}, Parent Tab ID: ${tabInfo.parentId}, Tab ID: ${tabInfo.tabId}, URL: ${tabInfo.currentPage.url}, Title: ${tabInfo.currentPage.title}`;
        // tabsInfoContainer.appendChild(tabInfoElement);
      // }
    // });
  // }).catch((error) => {
    // console.error('Error fetching tab info:', error);
  // });
// });
/* document.addEventListener('DOMContentLoaded', function() {
  browser.storage.local.get(null).then((items) => {
    const tabsInfoContainer = document.getElementById('tabsInfoContainer');
    Object.keys(items).forEach((key) => {
      if (key.startsWith('tabInfo_')) {
        const tabInfo = JSON.parse(items[key]);
        // 检查Tab ID是否存在
        checkTabExists(tabInfo.tabId).then((status) => {
          const tabInfoElement = document.createElement('div');
          tabInfoElement.textContent = `Window ID: ${tabInfo.windowId}, Parent Tab ID: ${tabInfo.parentId}, Tab ID: ${tabInfo.tabId} (${status}), URL: ${tabInfo.currentPage.url}, Title: ${tabInfo.currentPage.title}`;
          tabsInfoContainer.appendChild(tabInfoElement);
        });
      }
    });
  }).catch((error) => {
    console.error('Error fetching tab info:', error);
  });
}); */

/* document.addEventListener('DOMContentLoaded', function() {
  browser.storage.local.get(null).then((items) => {
    // 创建一个映射，用于按窗口ID组织标签页信息
    const windowsMap = {};

    // 遍历所有存储的项，将它们按窗口ID分组
    Object.keys(items).forEach((key) => {
      if (key.startsWith('tabInfo_')) {
        const tabInfo = JSON.parse(items[key]);
        // 如果这个窗口ID还没有在映射中，就添加一个新的数组
        if (!windowsMap[tabInfo.windowId]) {
          windowsMap[tabInfo.windowId] = [];
        }
        // 将标签页信息添加到对应窗口ID的数组中
        windowsMap[tabInfo.windowId].push(tabInfo);
      }
    });

    // 现在按窗口ID遍历映射，并显示每个窗口下的标签页信息
    const tabsInfoContainer = document.getElementById('tabsInfoContainer');
    Object.keys(windowsMap).forEach((windowId) => {
      const windowElement = document.createElement('div');
      windowElement.textContent = `Window ID: ${windowId}`;
      tabsInfoContainer.appendChild(windowElement);

      const listElement = document.createElement('ul');
      windowsMap[windowId].forEach((tabInfo) => {
        const tabElement = document.createElement('li');
        tabElement.textContent = `Parent Tab ID: ${tabInfo.parentId}, Tab ID: ${tabInfo.tabId}, URL: ${tabInfo.currentPage.url}, Title: ${tabInfo.currentPage.title}`;
        listElement.appendChild(tabElement);
      });
      tabsInfoContainer.appendChild(listElement);
    });
  }).catch((error) => {
    console.error('Error fetching tab info:', error);
  });
}); */

document.addEventListener('DOMContentLoaded', function() {
  browser.storage.local.get(null).then((items) => {
    const tabsInfoContainer = document.getElementById('tabsInfoContainer');

    // 遍历所有存储的项，直接显示每个标签页信息
    Object.keys(items).forEach((key) => {
      if (key.startsWith('tabInfo_')) {
        const tabInfo = JSON.parse(items[key]);
        displayTabBasedOnClass(tabInfo, tabsInfoContainer);
      }
    });
  }).catch((error) => {
    console.error('Error fetching tab info:', error);
  });
});

function displayTabBasedOnClass(tabInfo, container) {
  // 初始化缩进级别为0
  let indentLevel = 0;

  // 如果存在parentId，根据parentId调整缩进级别
  if (tabInfo.parentId) {
    const parentClass = `tab-${tabInfo.parentId}`;
    const parentElement = container.querySelector(`.${parentClass}`);
    if (parentElement) {
      const parentLevel = parseInt(parentElement.dataset.level, 10);
      indentLevel = parentLevel + 1;
    }
  }

  const tabElement = document.createElement('div');
  tabElement.classList.add(`tab-${tabInfo.tabId}`, 'tabElement');
  tabElement.dataset.level = indentLevel; // 使用data属性存储层级，方便后续操作
  tabElement.style.paddingLeft = `${20 * indentLevel}px`; // 根据缩进级别调整左边距

  const button = document.createElement('button');
  button.classList.add('tabButton', tabInfo.isClosed ? 'inactive' : 'active');
  button.textContent = `Tab ID: ${tabInfo.tabId}, Title: ${tabInfo.currentPage.title.substring(0, 30)}...`;
  button.onclick = function() {
    if (!tabInfo.isClosed) {
      browser.tabs.update(tabInfo.tabId, {active: true});
    } else {
      window.open(tabInfo.currentPage.url, '_blank');
    }
  };
  tabElement.appendChild(button);

  container.appendChild(tabElement);
}










