    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // 从本地存储中获取历史记录数据
            chrome.storage.local.get(['todayHistory'], function(result) {
                var historyItems = result.todayHistory || [];
                var list = document.createElement('ul');
                historyItems.forEach(function(item) {
                    var listItem = document.createElement('li');
                    listItem.textContent = item.title + ' - ' + item.url;
                    list.appendChild(listItem);
                });
                document.body.appendChild(list);
            });
        });
    </script>
