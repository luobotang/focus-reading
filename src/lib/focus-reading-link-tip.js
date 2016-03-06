/*
 * FocusReadingLinkTip
 * 跟踪鼠标在页面有效链接上的停留，显示“专注阅读”，以便在打开的页面中直接启用阅读模式
 */

var $ = require('jquery')

var FocusReadingLinkTip = {}
var urlHandlers = $.Callbacks()

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
			e.preventDefault()
			window.open(url, 'focus-reading-window')
		}
	})

	/*
	 * 处理 URL 链接地址
	 */

	urlHandlers.add(function (urlParts) {
		if (urlParts.search) {
			urlParts.search += '&focus-reading=true'
		} else {
			urlParts.search = '?focus-reading=true'
		}
	})

	if (location.hostname === 'www.guancha.cn') {
		urlHandlers.add(function (urlParts) {
			// 观察者网的文章页面，貌似地址后面加个 "_s" 就是全文阅读版本的页面
			// 所以，为了方便，都加下吧
			// url 文件名示例：2016_02_02_350043.shtml
			// 更改后应该是：2016_02_02_350043_s.shtml
			var oldPath = urlParts.path
			var dotIndex = oldPath.lastIndexOf('.')
			urlParts.path = oldPath.substr(0, dotIndex) + '_s' + oldPath.substr(dotIndex)
		})
	}

	if (location.hostname.indexOf('bitauto.com') > 0) {
		urlHandlers.add(function (urlParts) {
			// 尽量显示全部内容
			// @example
			// http://news.bitauto.com/gcsc/20140618/1506456685.html
			// http://news.bitauto.com/gcsc/20140618/1506456685_all.html
			var oldPath = urlParts.path
			// xxxx/00000000/0000-0.html
			if (/\/[a-z]+\/\d{8}\/\d+(-\d)?\.html/i.test(oldPath)) {
				urlParts.path = urlParts.path.replace(/\/(\d+)(-\d)?.html/, function (m, m1) {
					return '/' + m1 + '_all' + '.html'
				})
			}
		})
	}
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
	var parts = parseUrl(url)
	urlHandlers.fire(parts)
	return parts.path + parts.search + parts.hash
}

function parseUrl(url) {
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
	return {
		original: url,
		path: rest,
		search: search,
		hash: hash
	}
}

module.exports = FocusReadingLinkTip