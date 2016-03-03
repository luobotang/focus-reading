/*
 * 尝试从一个任意页面解析出文章内容
 */

var $ = require('jquery')

var commonTitleSelectorList = [
	'h1.title',
	'h1',
	'#h1title',
	'#title',
	'.ArticleTitle',
	'.title',
	'h2'
]
var commonContentSelectorList = [
	'#articleContent',
	'#article_content',
	'#contentText',
	'#content',
	'#abody',
	'#endText',
	'.articalContent',
	'.main-content',
	'.article_body',
	'.article-contents',
	'.ArticleContent',
	'.article',
	'.show-content'
]

exports.match = '*' // 匹配任意页面

exports.title = function () {
	var $title = tryGetSingleMatchFromSelectorList(commonTitleSelectorList)
	if ($title) {
		return $title.text()
	} else {
		return document.title
	}
}

exports.content = function () {
	var $content = tryGetSingleMatchFromSelectorList(commonContentSelectorList)
	if ($content) {
		return $content.html()
	} else {
		return null
	}
}

function tryGetSingleMatchFromSelectorList(list) {
	var i = 0
	var $match
	while (($match = $(list[i++]))) {
		if ($match.length === 1) {
			console.debug('match selector: ' + list[i - 1])
			return $match
		}
	}
	return null
}