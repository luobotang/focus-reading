/*
 * ArticleGeneratorManager
 * 管理网页“内容提供器”
 */

var $ = require('jquery')

var ArticleGeneratorManager = {}

/**
 * 1. generator object
 * @param {Object} generator
 *   - name {sring}
 *   - title {string|function}
 *   - content {string|function}
 *
 * 2. generator params
 * @param {string} - name
 * @param {string|function} - title selector | generator
 * @param {string|function} - content selector | generator
 */
ArticleGeneratorManager.add = function (generator) {
	if (typeof generator === 'object') {
		this.generators.push(generator)
	} else if (arguments.length === 3) {
		this.generators.push({
			name: arguments[0],
			title: arguments[1],
			content: arguments[2]
		})
	}
	return this
}

ArticleGeneratorManager.generatArticle = function () {
	var generator
	var hostname = location.hostname
	var i = 0
	while ((generator = this.generators[i++])) {
		if (hostname.indexOf(generator.name) > -1) {
			var articleClass = 'focus-reading-article-' + generator.name.replace(/\./g, '-')
			var title = this.getText(generator.title)
			var content = this.getHtml(generator.content)
			if (title && content) {
				return {
					articleClass: articleClass,
					title: title,
					content: content
				}
			}
		}
	}
	return null
}

ArticleGeneratorManager.init = function () {
	this.generators = []
}

ArticleGeneratorManager.getText = function (s) {
	if (typeof s === 'string') {
		return $(s).text()
	} else if (typeof s === 'function') {
		return s()
	} else {
		return null
	}
}

ArticleGeneratorManager.getHtml = function (s) {
	if (typeof s === 'string') {
		return this.tryRemoveStyleInfo($(s).html())
	} else if (typeof s === 'function') {
		return this.tryRemoveStyleInfo(s())
	} else {
		return null
	}
}

ArticleGeneratorManager.tryRemoveStyleInfo = function (html) {
	var reStyleAttr = /(<[^>]+)(style="[^"]+"|style='[^']+')([^>]*>)/g
	return (
		html
		.replace(reStyleAttr, function (m, prev, styleAttr, after) {
			return prev + after
		})
	)
}

module.exports = ArticleGeneratorManager