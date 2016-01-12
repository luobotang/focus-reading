(function () {

	var TEMPLATE_BUTTON = (
		'<button id="focus-reading-button" title="Focus Reading">FR</button>'
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
			'<h1>' + title + '</h1>' +
			content
		)
		$readingPad.show()
		$('html,body').addClass(CLASS_READING_PAD_SHOWING)
		$(document).on('keydown', hidePadOnEscKeydown)

		// everytime show pad, focus at the start
		$readingPad.animate({'scrollTop': 0}, 500)
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
			alert('Focus Reading: Can not find anything to read.')
		}
	}

	function hidePadOnEscKeydown(e) {
		if (e.keyCode === 27) {
			hidePad()
		}
	}

	/**
	 * 1. generator object
	 * @param {Object} siteGenerator
	 *   - name {sring}
	 *   - title {string|function}
	 *   - content {string|function}
	 *
	 * 2. generator params
	 * @param {string} - name
	 * @param {string|function} - title selector | generator
	 * @param {string|function} - content selector | generator
	 */
	ContentGenerator.add = function (generator) {
		if (typeof siteGenerator === 'object') {
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

	ContentGenerator.generatArticle = function () {
		var generator
		var hostname = location.hostname
		var i = 0
		while ((generator = this.generators[i++])) {
			if (hostname.indexOf(generator.name) > -1) {
				var title = getText(generator.title)
				var content = getHtml(generator.content)
				if (title && content) {
					return {
						title: title,
						content: content
					}
				}
			}
		}
		return null
	}

	ContentGenerator
	.add('gamersky.com', 'h1', '.Mid2L_con')
	.add('movie.douban', 'h1', '#link-report')
	.add('baike.baidu', 'h1', '.main-content')
	.add('jianshu.com', 'h1.title', '.show-content')
	.add('tieba.baidu', 'h1', function () {
		return [].map.call(
		$('.d_post_content'), function (content) {
			return (
				'<section>' +  content.innerHTML + '</section>'
			)
		}).join('')
	})
	.add('guancha.cn', '.content-title1', '.all-txt')
	.add('tuicool.com', 'h1', '.article_body')
	.add('chinanews.com', 'h1', '.left_zw')
	.add('xinhuanet.com', '#title', '.article')
	.add('21ccom.net', 'h4', '#contents')
	.add('chinavalue.net', '.ArticleTitle', '.ArticleContent')
	.add('dajia.qq.com', 'h1', '#content')
	.add('news.163.com', '#h1title', '#endText')
	.add('zhihu.com', getZhihuTitle, getZhihuContent)
	.add('tech.163.com', 'h1', '#endText')

	function getText(s) {
		if (typeof s === 'string') {
			return $(s).text()
		} else if (typeof s === 'function') {
			return s()
		} else {
			return null
		}
	}

	function getHtml(s) {
		if (typeof s === 'string') {
			return tryRemoveStyleInfo($(s).clone())
		} else if (typeof s === 'function') {
			return s()
		} else {
			return null
		}
	}

	function tryRemoveStyleInfo(el, deep) {
		var $el = $(el).attr('style', '')

		$el.children().each(function (i, el) {
			tryRemoveStyleInfo(el, true)
		})

		if (!deep) {
			return $el.html()
		}
	}

	function getZhihuTitle() {
		if (location.pathname.startsWith('/question')) {
			return $('.zm-item-title').text()
		} else {
			var $item = getZhihuReadingItemOnIndexPage()
			if ($item) {
				return $item.find('h2').text()
			} else {
				return null
			}
		}
	}

	function getZhihuContent() {
		if (location.pathname.startsWith('/question')) {
			var $answer = getZhihuReadingItemOnQuestionPage()
			if ($answer) {
				return (
				'<p class="zhihu-user">' +
					$answer.find('.zm-item-answer-author-info').html() +
				'</p>' +
				$answer.find('.zm-editable-content').html()
				)
			} else {
				return null
			}
		} else {
			var $item = getZhihuReadingItemOnIndexPage()
			if ($item) {
				var html = ''

				html += (
				'<p class="zhihu-user">' +
					(
						$item.find('.zm-item-answer-author-info').html() ||
						$item.find('.author-info').html()
					) +
				'</p>'
				)
				html += $item.find('textarea.content').val()

				return html
			} else {
				return null
			}
		}
	}

	function getZhihuReadingItemOnIndexPage() {
		return findReadingElement('.zm-item-expanded')
	}

	function getZhihuReadingItemOnQuestionPage() {
		return findReadingElement('.zm-item-answer')
	}

	function findReadingElement(selector) {
		var $items =  $(selector)
		var item
		var i = 0
		while ((item = $items[i++])) {
			if (isElementInReading(item)) {
				return $(item)
			}
		}
		return null
	}

	function isElementInReading(el) {
		var scrollTop = document.body.scrollTop
		var screenHeight = $(window).height()

		var $item = $(el)
		var itemTop = $item.offset().top
		var itemHeight = $item.height()

		if (itemTop > scrollTop) {
			if (itemTop < scrollTop + screenHeight) {
				return true
			} else {
				return false
			}
		} else if (itemTop + itemHeight > scrollTop + 100) {
			return true
		} else {
			return false
		}
	}

	tryInit()
})()