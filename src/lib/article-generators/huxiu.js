var $ = require('jquery')

exports.name = 'www.huxiu.com'
exports.title = 'h1'
exports.content = function () {
	return $('.article-img-box').html() + $('#article_content').html()
}