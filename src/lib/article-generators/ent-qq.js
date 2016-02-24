var $ = require('jquery')

exports.name = 'ent.qq.com'

exports.title = function () {
	return $('#articleContent').find('.tuzhu').eq(0).html()
}

exports.content = '#articleContent'