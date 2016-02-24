var $ = require('jquery')

exports.name = 'haodf.com'

exports.title = 'h1'

exports.content = function () {
	var $el = $('.article_detail .article_detail')
	if ($el.length === 1) {
		return $el.html()
	} else if ($el.length === 0) {
		return $('.article_detail').html()
	} else {
		// do nothing
	}
}