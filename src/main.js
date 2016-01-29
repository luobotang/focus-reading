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

var TEMPLATE_BUTTON = (
	'<button id="focus-reading-button" title="Focus Reading">FR</button>'
)

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
	var $button = $(TEMPLATE_BUTTON).appendTo('body')
	$button.on('click', focusRead)

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
}

function focusRead() {
	var article = ArticleGeneratorManager.generatArticle()
	if (article) {
		FocusReadingPad.show(article.title, article.content)
		FocusReadingLinkTip.stop()
	} else {
		alert('Focus Reading: Can not find anything to read.')
	}
}