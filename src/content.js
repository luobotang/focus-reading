/*
 * Focus Reading 内部逻辑图：
 *
 *  ArticleGenerator --(register)--> ArticleGeneratorManager
 *                                            |
 *                                        (generate)
 *                                            |
 *                                            V
 *              FocusReadingPad   <----    Article
 *  
 */

var $ = require('jquery')
var ArticleGeneratorManager = require('./lib/article-generator-manager')
var ArticleGenerators = require('./lib/article-generators/')
var FocusReadingPad = require('./lib/focus-reading-pad')
var FocusReadingLinkTip = require('./lib/focus-reading-link-tip')

tryInit()

// init as soon as possible
// even before document ready
function tryInit() {
	if (document.body) {
		init()
	} else {
		setTimeout(tryInit, 100)
	}
}

function init() {

	ArticleGeneratorManager.init()
	ArticleGenerators.registerAll()
	FocusReadingPad.init()
	FocusReadingLinkTip.init()

	/*
	 * 自动进入专注阅读模式
	 */
	if (location.search.indexOf('focus-reading=true') > 0) {
		focusRead()
	} else {
		FocusReadingLinkTip.start()
	}

	/*
	 * 通过点击 page_action 图标进入专注阅读模式
	 */
	chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
		focusRead()
	})
}

function focusRead() {
	var article = ArticleGeneratorManager.generatArticle()
	if (article) {
		FocusReadingPad.show(article.title, article.content, article.articleClass)
		FocusReadingLinkTip.stop()
	} else {
		alert('Focus Reading: Can not find anything to read.')
	}
}