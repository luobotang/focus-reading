/*
 * ArticleGeneratorManager
 * 管理网页“内容提供器”
 */

var $ = require('jquery')

var ArticleGeneratorManager = {}

/**
 * 1. generator object
 * @param {Object} generator
 *   - [match] {string|RegExp}
 *   - [name] {sring}
 *   - title {string|function}
 *   - content {string|function}
 *
 * 2. generator params
 * @param {string|RegExp} - [match]
 * @param {string} - name
 * @param {string|function} - title selector | generator
 * @param {string|function} - content selector | generator
 */
ArticleGeneratorManager.add = function (generator) {
	if (typeof generator === 'object') {
		if (generator.match) {
			// ok, has match
		} else {
			generator.match = generator.name
		}
		this.generators.push(generator)
	} else {
		if (arguments.length === 3) {
			this.generators.push({
				match: arguments[0], // !!!
				name: arguments[0],
				title: arguments[1],
				content: arguments[2]
			})
		} else if (arguments.length === 4) {
			this.generators.push({
				match: arguments[0],
				name: arguments[1],
				title: arguments[2],
				content: arguments[3]
			})
		}
	}
	return this
}

ArticleGeneratorManager.generatArticle = function () {
	var generator
	var url = location.href
	var articleClass
	var i = 0
	while ((generator = this.generators[i++])) {
		var pattern = matchUrlPattern()
		if (matchUrlPattern(url, generator.match)) {
			if (generator.name) {
				articleClass = 'focus-reading-article-' + generator.name.replace(/\./g, '-')
			} else {
				articleClass = 'focus-reading-article-any'
			}

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
	var reFontElement = /<font[^>]*>/g
	return typeof html === 'string' ? (
		html
		.replace(reStyleAttr, function (m, prev, styleAttr, after) {
			return prev + after
		})
		.replace(reFontElement, function (m) {
			return '<font>'
		})
	) : null
}

/*
 * 判断 url 与指定的 pattern 是否匹配
 *
 * @param {string} url
 * @param {string|RegExp} pattern
 * @return {boolean}
 */
function matchUrlPattern(url, pattern) {
	if (pattern) {
		if (typeof pattern === 'string') {
			pattern = makePatternRegExp(pattern)
		}
		return pattern.test(url)
	} else {
		return false
	}
}

/*
 * @param {string} pattern
 * @return {RegExp}
 *
 * @example
 * 'www.example.com' -> new RegExp
 */
function makePatternRegExp(pattern) {
	return new RegExp(
		pattern
		.replace(/\./, '\\.')
		.replace(/\*/, '\\w*')
	)
}

module.exports = ArticleGeneratorManager