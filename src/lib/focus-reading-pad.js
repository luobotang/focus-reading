/*
 * FocusReadingPad
 * 文章阅读面板
 */

var $ = require('jquery')

var EVENT_SHOW = 'show'
var EVENT_HIDE = 'hide'

var FocusReadingPad = {}

FocusReadingPad.init = function () {
	this.$readingPad = $(this.TEMPLATE_PAD).hide().appendTo('body')
	this.$readingPad.on('click', '.button-close', this.hide.bind(this))
	this._event = $({})
}

FocusReadingPad.TEMPLATE_PAD = (
	'<div id="focus-reading-pad">' +
		'<a class="button-close">×</a>' +
		'<div id="focus-reading-pad-content"></div>' +
	'</div>'
)
FocusReadingPad.CLASS_READING_PAD_SHOWING = 'focus-reading'

FocusReadingPad.show = function (title, content, articleClass) {
	this.$readingPad.find('#focus-reading-pad-content').html(
		'<div class="focus-reading-article-title">' + title + '</div>' +
		'<div class="focus-reading-article-content">' + content + '</div>'
	)

	if (articleClass) {
		this.$readingPad.addClass(articleClass)
	}

	$('html,body').addClass(this.CLASS_READING_PAD_SHOWING)
	$(document).on('keydown', this._hideOnEscKeydown)

	this.$readingPad.fadeIn(function () {
		// everytime show pad, focus at the start
		this.$readingPad.animate({'scrollTop': 0}, 500)
		this._event.trigger(EVENT_SHOW)
	}.bind(this))
}

FocusReadingPad.hide = function () {
	$(document).off('keydown', this._hideOnEscKeydown)

	this.$readingPad.fadeOut(function () {
		$('html,body').removeClass(this.CLASS_READING_PAD_SHOWING)
		// 清空，避免再次查看时从面板中获取内容
		FocusReadingPad.$readingPad.find('#focus-reading-pad-content').empty()
		this._event.trigger(EVENT_HIDE)
	}.bind(this))
}

FocusReadingPad._hideOnEscKeydown = function (e) {
	if (e.keyCode === 27) {
		FocusReadingPad.hide()
	}
}

/*
 * 实现事件机制
 *
 * 发布的事件：
 * - show
 * - hide
 */

FocusReadingPad.on = function () {
	this._event.on.apply(this._event, arguments)
	return this
}

FocusReadingPad.off = function () {
	this._event.off.apply(this._event, arguments)
	return this
}

module.exports = FocusReadingPad