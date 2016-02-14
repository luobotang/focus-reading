chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	// TODO 判断当前页面是否支持 FocusReading，支持时才显示图标
	chrome.pageAction.show(tabId)
})

chrome.pageAction.onClicked.addListener(function (tab) {
	chrome.tabs.sendRequest(tab.id, {}, function (response) {
		// 暂时不做任何处理，只是通过触发请求来尝试使页面进入专注阅读模式
		// 注意：第二个参数需要保留（即便为空对象），使用 null 时无法触发请求
	})
})