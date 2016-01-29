/*
 * FocusReadingLinkTip
 * 跟踪鼠标在页面有效链接上的停留，显示“专注阅读”，以便在打开的页面中直接启用阅读模式
 */

var $ = require('jquery')

var FocusReadingLinkTip = {}

FocusReadingLinkTip.init = function () {
	var lazyTimer = null
	var $link = null
	$(document).on('mouseenter mouseleave', 'a', function (e) {
		if (FocusReadingLinkTip._enabled) {
			if (e.type === 'mouseleave' || lazyTimer) {
				clearTimeout(lazyTimer)
				lazyTimer = null
				$link = null
			} else {
				$link = $(e.currentTarget)
				var url = $link.attr('href')
				if (
					url &&
					!(url.startsWith('#') || url.startsWith('javascript')) &&
					$link.find('.focus-reading-tip-for-link').length === 0
				) {
					lazyTimer = setTimeout(function () {
						$link.prepend(FocusReadingLinkTip._makeFocusReadingTip(
							FocusReadingLinkTip._addFocusReadingTagToUrl($link.attr('href'))
						))
					}, 100)
				}
			}
		} else {
			clearTimeout(lazyTimer)
			lazyTimer = null
			$link = null
		}
	}).on('click', '.focus-reading-tip-for-link', function (e) {
		var url = $(e.currentTarget).attr('data-url')
		if (url) {
			window.open(url, 'focus-reading-window')
		}
		e.preventDefault()
	})
}

FocusReadingLinkTip.start = function () {
	this._enabled = true
}

FocusReadingLinkTip.stop = function () {
	this._enabled = false
}

FocusReadingLinkTip._makeFocusReadingTip = function (url) {
	return (
	'<span class="focus-reading-tip-for-link" data-url="' + url + '">' +
		'专注阅读' +
	'</span>'
	)
}

FocusReadingLinkTip._addFocusReadingTagToUrl = function (url) {
	var rest = url
	var search
	var hash

	var hashIndex = rest.indexOf('#')
	if (hashIndex > -1) {
		hash = rest.substr(hashIndex)
		rest = rest.substr(0, hashIndex)
	} else {
		hash = ''
	}

	var searchIndex = rest.indexOf('?')
	if (searchIndex > -1) {
		search = rest.substr(searchIndex)
		rest = rest.substr(0, searchIndex)
	} else {
		search = ''
	}

	return rest + (search.length > 0 ? search + '&focus-reading=true' : '?focus-reading=true') + hash
}

module.exports = FocusReadingLinkTip