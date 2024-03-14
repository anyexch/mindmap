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


