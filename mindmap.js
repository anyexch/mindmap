document.addEventListener('DOMContentLoaded', function() {
    browser.storage.local.get(['todayHistory'], function(result) {
        var historyItems = result.todayHistory || [];
        var list = document.createElement('ul');
        list.style.listStyleType = 'none'; // 移除列表项前的标记
        historyItems.forEach(function(item) {
            var listItem = document.createElement('li');
            var button = document.createElement('button');
            button.innerHTML = `${item.title} - <a href='${item.url}' target='_blank'>${item.url.substring(0, 30)}...</a>`;
            button.className = 'history-item'; // 添加类名以便CSS样式化
            listItem.appendChild(button);
            list.appendChild(listItem);
        });
        document.body.appendChild(list);
    });
});

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
document.addEventListener('DOMContentLoaded', function() {
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
});

// 增加递归函数来显示 mindtree
function buildTreeHtml(node, depth = 0) {
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
}

// 在DOMContentLoaded事件处理器中使用buildTreeHtml函数
document.addEventListener('DOMContentLoaded', function() {
    browser.storage.local.get('tabsTree').then(data => {
        const tabsTree = data.tabsTree || {};
        const mapContainer = document.getElementById('mindmap');
        const treeHtml = buildTreeHtml(tabsTree); // 构建标签树的HTML
        if (treeHtml) mapContainer.appendChild(treeHtml);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // 获取所有存储的TabInfo对象
    browser.storage.local.get(null).then((items) => {
        const tabsInfoContainer = document.getElementById('tabsInfoContainer'); // 假设你有一个ID为tabsInfoContainer的元素用于显示标签信息
        Object.keys(items).forEach((key) => {
            if (key.startsWith('tabInfo_')) { // 确保只处理TabInfo对象
                const tabInfoStr = items[key];
                const tabInfo = JSON.parse(tabInfoStr); // 将字符串反序列化为TabInfo对象

                // 创建一个元素来显示TabInfo信息
                const tabInfoElement = document.createElement('div');
                tabInfoElement.textContent = `Tab ID: ${tabInfo.tabId}, URL: ${tabInfo.currentPage.url}, Title: ${tabInfo.currentPage.title}`;
                tabsInfoContainer.appendChild(tabInfoElement);
            }
        });
    }).catch((error) => {
        console.error('Error fetching tab info:', error);
    });
});


