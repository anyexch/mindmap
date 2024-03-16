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
  let indentLevel = 0;

  // 检查或创建对应windowId的窗口容器
  let windowContainer = container.querySelector(`.window-${tabInfo.windowIds[tabInfo.windowIds.length - 1]}`);
  if (!windowContainer) {
    windowContainer = document.createElement('div');
    windowContainer.classList.add(`window-${tabInfo.windowIds[tabInfo.windowIds.length - 1]}`);
    const windowTitle = document.createElement('div');
    windowTitle.textContent = `Window ID: ${tabInfo.windowIds[tabInfo.windowIds.length - 1]}`;
    windowTitle.classList.add('windowTitle');
    windowContainer.appendChild(windowTitle);
    container.appendChild(windowContainer);
  }

  // 尝试找到父标签页元素
  const parentClass = tabInfo.parentId ? `tab-${tabInfo.parentId}` : null;
  let parentElement = parentClass ? windowContainer.querySelector(`.${parentClass}`) : null;

  // 如果有父标签页，缩进级别增加
  if (parentElement) {
    const parentLevel = parseInt(parentElement.dataset.level, 10);
    indentLevel = parentLevel + 1;
  } else {
    // 如果没有父标签页，则作为顶层标签页处理
    parentElement = windowContainer; // 使用窗口容器作为父元素
  }

  const tabElement = document.createElement('div');
  tabElement.classList.add(`tab-${tabInfo.tabId}`, 'tabElement');
  tabElement.dataset.level = indentLevel;
  tabElement.style.paddingLeft = `${20 * indentLevel}px`;

  const button = document.createElement('button');
  button.classList.add('tabButton', tabInfo.isClosed ? 'inactive' : 'active');
  button.textContent = `Tab ID: ${tabInfo.tabId}, Title: ${tabInfo.currentPage.title.substring(0, 30)}...`;
  browser.tabs.get(tabInfo.tabId).then(tab => {
    if (tab.active) {
      button.classList.add('activeTab');
    } else {
      button.classList.add('inactiveTab');
    }
  }).catch(error => {
    console.log(`Error retrieving tab info: ${error}`);
    // 可能是一个已关闭的标签页
    button.classList.add('inactiveTab');
  });
	button.onclick = function() {
	  if (!tabInfo.isClosed) {
		// 首先激活标签页所在的窗口
		browser.windows.update(tabInfo.windowIds[tabInfo.windowIds.length - 1], {focused: true}).then(() => {
		  // 然后聚焦到该标签页
		  browser.tabs.update(tabInfo.tabId, {active: true});
		}).catch(error => {
		  console.log(`Error focusing window or tab: ${error}`);
		});
	  } else {
		// 如果标签页已关闭，就在新窗口中打开它
		window.open(tabInfo.currentPage.url, '_blank');
	  }
	};

  tabElement.appendChild(button);

  // 创建历史记录的容器
  const historyContainer = document.createElement('div');
  historyContainer.classList.add('historyContainer');
  historyContainer.style.display = 'none'; // 默认不显示
  historyContainer.style.paddingLeft = `${20}px`; // 添加一点左边距

  // 如果历史记录数量大于1，添加一个折叠按钮来控制显示
  if (tabInfo.history.length > 1) {
    const historyToggle = document.createElement('button');
    historyToggle.textContent = '+';
    historyToggle.classList.add('tabButton'); // 应用与其他按钮相同的样式
    historyToggle.onclick = function() {
      const isExpanded = historyContainer.style.display !== 'none';
      historyToggle.textContent = isExpanded ? '+' : '-';
      historyContainer.style.display = isExpanded ? 'none' : 'block';
    };
    tabElement.insertBefore(historyToggle, button.nextSibling);

    // 添加历史记录到历史容器中
	tabInfo.history.forEach((historyItem, index) => {
	  if (index === tabInfo.history.length - 1) return; // 跳过最新（当前）记录
	  const historyButton = document.createElement('button');
	  historyButton.classList.add('tabButton', 'historyButton', 'historyTab'); // 添加新的historyTab类
	  historyButton.textContent = `History: ${historyItem.title.substring(0, 30)}...`;
	  historyButton.onclick = function() {
		window.open(historyItem.url, '_blank');
	  };
	  historyContainer.appendChild(historyButton);
	  historyContainer.appendChild(document.createElement('br')); // 在按钮之间添加换行
	});
  }

  tabElement.appendChild(historyContainer);
  container.appendChild(tabElement);
  parentElement.appendChild(tabElement);
}










