var $ = require('jquery')

exports.name = 'bbs.tianya.cn'
exports.title = '.s_title'
exports.content = function () {
	return Array.prototype.map.call($('.atl-item'), function (item) {
		var $item = $(item)
		var userName = decodeURIComponent($item.attr('js_username') || $item.attr('_host'))
		var replyTime = $item.attr('js_restime') || $('.js-bbs-act').attr('js_replytime') /* 楼主 */
		return (
			'<section>' +
				'<p>' + userName + ' - ' + replyTime + '</p>' +
				replaceImgSrcWithOriginal($item.find('.bbs-content')).html() +
			'</section>'
		)
	}).join('')
}

/*
 * @return {jQueryElement} - cloned
 */
function replaceImgSrcWithOriginal($el) {
	$clone = $el.clone()
	$clone.find('img').each(function (i, img) {
		var originalSrc = $(img).attr('original')
		if (originalSrc) {
			$(img).attr('src', originalSrc)
		}
	})
	return $clone
}