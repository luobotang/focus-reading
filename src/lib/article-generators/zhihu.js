/*
 * ZhihuArticleGenerator
 * 用于知乎网站的内容生成器
 */

var $ = require('jquery')

var ZhihuArticleGenerator = {}

ZhihuArticleGenerator.name = 'zhihu.com'

ZhihuArticleGenerator.title = function () {
	if (location.pathname.startsWith('/question')) {
		return $('#zh-question-title a').text()
	} else {
		var $item = ZhihuArticleGenerator.getReadingItemOnIndexPage()
		if ($item) {
			return $item.find('h2').text()
		} else {
			return null
		}
	}
}

ZhihuArticleGenerator.content = function () {
	if (location.pathname.startsWith('/question')) {
		var $answer = ZhihuArticleGenerator.getReadingItemOnQuestionPage()
		if ($answer) {
			return (
				'<p class="zhihu-user">' +
					(
						$answer.find('.zm-item-answer-author-info').html()
					) +
				'</p>' +
				ZhihuArticleGenerator.processHTML(
					$answer.find('.zm-editable-content').html()
				)
			)
		} else {
			return null
		}
	} else {
		var $item = ZhihuArticleGenerator.getReadingItemOnIndexPage()
		if ($item) {
			return (
				'<p class="zhihu-user">' +
					(
						$item.find('.zm-item-answer-author-info').html() ||
						$item.find('.author-info').html()
					) +
				'</p>' +
				ZhihuArticleGenerator.processHTML(
					$item.find('textarea.content').val()
				)
			)
		} else {
			return null
		}
	}
}

ZhihuArticleGenerator.processHTML = function (html) {
	var regNoscript = /\<noscript\>[^<]*\<\/noscript\>/g
	var regImg = /\<img [^>]*(data-original|data-actualsrc)=(\S+)[^>]*\>/g
	return html
	.replace(regNoscript, '')
	.replace(regImg, function (m, attr, src) {
		return '<img src=' + src + '>'
	})
}

ZhihuArticleGenerator.getReadingItemOnIndexPage = function () {
	return this.findReadingElement('.zm-item-expanded')
}

ZhihuArticleGenerator.getReadingItemOnQuestionPage = function () {
	return this.findReadingElement('.zm-item-answer')
}

ZhihuArticleGenerator.findReadingElement = function (selector) {
	var $items =  $(selector)
	var item
	var i = 0
	while ((item = $items[i++])) {
		if (this.isElementInReading(item)) {
			return $(item)
		}
	}
	return null
}

ZhihuArticleGenerator.isElementInReading = function (el) {
	var scrollTop = document.body.scrollTop
	var screenHeight = $(window).height()

	var $item = $(el)
	var itemTop = $item.offset().top
	var itemHeight = $item.height()

	if (itemTop > scrollTop) {
		if (itemTop < scrollTop + screenHeight) {
			return true
		} else {
			return false
		}
	} else if (itemTop + itemHeight > scrollTop + 100) {
		return true
	} else {
		return false
	}
}

module.exports = ZhihuArticleGenerator