(function () {

	var TEMPLATE_BUTTON = (
		'<button id="focus-reading-button">Focus Reading</button>'
	)
	var TEMPLATE_PAD = (
		'<div id="focus-reading-pad">' +
			'<a id="focus-reading-pad-close-button">×</a>' +
			'<div id="focus-reading-pad-content"></div>' +
		'</div>'
	)
	var CLASS_READING_PAD_SHOWING = 'focus-reading'

	var ContentGenerator = {
		generators: []
	}
	var $readingPad

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

		$readingPad = $(TEMPLATE_PAD).hide().appendTo('body')
		$readingPad.on('click', '#focus-reading-pad-close-button', hidePad)
	}

	function showPad(title, content) {
		$readingPad.find('#focus-reading-pad-content').html(
			'<section>' +
				'<h1>' + title + '</h1>' +
				content +
			'</section>'
		)
		$readingPad.show()
		$('html,body').addClass(CLASS_READING_PAD_SHOWING)
		$(document).on('keydown', hidePadOnEscKeydown)
	}

	function hidePad() {
		$readingPad.hide()
		$('html,body').removeClass(CLASS_READING_PAD_SHOWING)
		$(document).off('keydown', hidePadOnEscKeydown)
	}

	function focusRead() {
		var article = ContentGenerator.generatArticle()
		if (article) {
			showPad(article.title, article.content)
		} else {
			alert('Can not find anything to read.')
		}
	}

	function hidePadOnEscKeydown(e) {
		if (e.keyCode === 27) {
			hidePad()
		}
	}

	/**
	 * @param {Object} siteGenerator
	 * - name {sring}
	 * - match {function}
	 * - title {function}
	 * - content {function}
	 */
	ContentGenerator.add = function (siteGenerator) {
		if (siteGenerator && siteGenerator.match) {
			this.generators.push(siteGenerator);
		}
		return this;
	}

	ContentGenerator.generatArticle = function () {
		var generator
		var hostname = location.hostname
		var i = 0
		while ((generator = this.generators[i++])) {
			if (generator.match(hostname)) {
				return {
					title: generator.title(),
					content: generator.content()
				}
			}
		}
		return null
	}

	ContentGenerator
	.add({
		name: 'gamersky.com',
		match: hasName,
		title: getH1Text,
		content: getHtml('.Mid2L_con')
	})
	.add({
		name: 'movie.douban',
		match: hasName,
		title: getH1Text,
		content: getHtml('#link-report')
	})
	.add({
		name: 'baike.baidu',
		match: hasName,
		title: getH1Text,
		content: getHtml('.main-content')
	})
	.add({
		name: 'jianshu',
		match: hasName,
		title: getText('h1.title'),
		content: getHtml('.show-content')
	})
	.add({
		name: 'tieba.baidu',
		match: hasName,
		title: getH1Text,
		content: function () {
			return [].map.call(
			$('.d_post_content'), function (content) {
				return (
				'<section>' + 
					content.innerHTML +
				'</section>'
				);
			}).join('')
		}
	})
	.add({
		name: 'guancha.cn',
		match: hasName,
		title: getText('.content-title1'),
		content: getHtml('.all-txt')
	})

	function hasName(hostname) {
		return hostname.indexOf(this.name) > -1
	}

	function getH1Text() {
		return $('h1').text()
	}

	function getText(el) {
		return function () {
			return $(el).text()
		}
	}

	function getHtml(el) {
		return function () {
			return $(el).html()
		}
	}

	tryInit()
})()