(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

// TODO 打开 link-tip 请求的新页面
//chrome.extension.onRequest(function () {
//	TODO chrome.windows.create
//})
},{}]},{},[1]);
