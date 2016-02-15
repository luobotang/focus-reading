/*
 * FocusReadingPad
 * 文章阅读面板
 */

var $ = require('jquery')
var FocusReadingLinkTip = require('./focus-reading-link-tip')

var FocusReadingPad = {}

FocusReadingPad.init = function () {
	this.$readingPad = $(this.TEMPLATE_PAD).hide().appendTo('body')
	this.$readingPad.on('click', '.button-close', this.hide.bind(this))
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
		'<h1>' + title + '</h1>' +
		content
	)

	if (articleClass) {
		this.$readingPad.addClass(articleClass)
	}

	$('html,body').addClass(this.CLASS_READING_PAD_SHOWING)
	$(document).on('keydown', this._hideOnEscKeydown)

	this.$readingPad.fadeIn(function () {
		// everytime show pad, focus at the start
		this.$readingPad.animate({'scrollTop': 0}, 500)
	}.bind(this))
}

FocusReadingPad.hide = function () {
	$(document).off('keydown', this._hideOnEscKeydown)

	this.$readingPad.fadeOut(function () {
		$('html,body').removeClass(this.CLASS_READING_PAD_SHOWING)
		FocusReadingLinkTip.start()
	}.bind(this))
}

FocusReadingPad._hideOnEscKeydown = function (e) {
	if (e.keyCode === 27) {
		FocusReadingPad.hide()
	}
}

module.exports = FocusReadingPad