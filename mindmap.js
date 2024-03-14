document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['todayHistory'], function(result) {
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

// 在 mindmap.js 中
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
