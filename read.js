/*
 * Focus Reading 内部逻辑图：
 *
 *  ArticleGenerator --(register)--> ArticleGeneratorManager
 *                                            |
 *                                        (generate)
 *                                            |
 *                                            V
 *              FocusReadingPad   <----    Article
 *  
 */
(function () {

	/*
	 * ArticleGeneratorManager
	 * 管理网页“内容提供器”
	 *
	 * require:
	 * - jquery
	 * - ZhihuArticleGenerator
	 * - BaiduTiebaArticleGenerator
	 */

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
				var title = this.getText(generator.title)
				var content = this.getHtml(generator.content)
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

	/*
	 * 初始化配置各站点内容生成器，感觉不在这里配置更好些？
	 */
	ArticleGeneratorManager.init = function () {
		this.generators = []
		this.add('gamersky.com', 'h1', '.Mid2L_con')
			.add('movie.douban', 'h1', '#link-report')
			.add('baike.baidu', 'h1', '.main-content')
			.add('jianshu.com', 'h1.title', '.show-content')
			.add(BaiduTiebaArticleGenerator)
			.add('guancha.cn', '.content-title1', '.all-txt')
			.add('tuicool.com', 'h1', '.article_body')
			.add('chinanews.com', 'h1', '.left_zw')
			.add('xinhuanet.com', '#title', '.article')
			.add('21ccom.net', 'h4', '#contents')
			.add('chinavalue.net', '.ArticleTitle', '.ArticleContent')
			.add('dajia.qq.com', 'h1', '#content')
			.add('news.163.com', '#h1title', '#endText')
			.add(ZhihuArticleGenerator)
			.add('tech.163.com', 'h1', '#endText')
			.add('udpwork.com', '#rss_item h2:first', '#rss_item .content')
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
			return this.tryRemoveStyleInfo($(s).clone())
		} else if (typeof s === 'function') {
			return s()
		} else {
			return null
		}
	}

	ArticleGeneratorManager.tryRemoveStyleInfo = function (el, deep) {
		var $el = $(el).attr('style', '')

		$el.children().each(function (i, el) {
			ArticleGeneratorManager.tryRemoveStyleInfo(el, true)
		})

		if (!deep) {
			return $el.html()
		}
	}



	/*
	 * BaiduTiebaArticleGenerator
	 * 用于百度贴吧的内容生成器
	 *
	 * require:
	 * - jquery
	 */

	var BaiduTiebaArticleGenerator = {}

	BaiduTiebaArticleGenerator.name = 'tieba.baidu'

	BaiduTiebaArticleGenerator.title = 'h1'

	BaiduTiebaArticleGenerator.content = function () {
		return [].map.call(
			$('.j_l_post'), function (post) {
				var $post = $(post)
				var $replys = $post.find('.core_reply_content').find('.lzl_single_post')
				
				return (
					'<section class="baidu-tieba-post">' +
						'<div class="baidu-tieba-user">' +
							$post.find('.p_author_name').text() +
						'</div>' +
						$post.find('.d_post_content').html() +
						(
						$replys.length > 0 ?
							'<ul class="baidu-tieba-replys">' +
								[].map.call($replys, function (reply) {
									return (
									'<li>' +
										$(reply).find('.j_user_card').attr('username') + '：' +
										$(reply).find('.lzl_content_main').text() +
									'</li>'
									)
								}).join('') +
							'</ul>'
							: ''
						) +
					'</section>'
				)
			}
		).join('')
	}



	/*
	 * ZhihuArticleGenerator
	 * 用于知乎网站的内容生成器
	 *
	 * require:
	 * - jquery
	 */

	var ZhihuArticleGenerator = {}

	ZhihuArticleGenerator.name = 'zhihu.com'

	ZhihuArticleGenerator.title = function () {
		if (location.pathname.startsWith('/question')) {
			return $('.zm-item-title').text()
		} else {
			var $item = ZhihuArticleGenerator.getReadingItemOnIndexPage()
			if ($item) {
				return $item.find('h2').text()
			} else {
				return null
			}
		}
	}

	ZhihuArticleGenerator.content = function () {
		if (location.pathname.startsWith('/question')) {
			var $answer = ZhihuArticleGenerator.getReadingItemOnQuestionPage()
			if ($answer) {
				return (
					'<p class="zhihu-user">' +
						(
							$answer.find('.zm-item-answer-author-info').html()
						) +
					'</p>' +
					ZhihuArticleGenerator.processHTML(
						$answer.find('.zm-editable-content').html()
					)
				)
			} else {
				return null
			}
		} else {
			var $item = ZhihuArticleGenerator.getReadingItemOnIndexPage()
			if ($item) {
				return (
					'<p class="zhihu-user">' +
						(
							$item.find('.zm-item-answer-author-info').html() ||
							$item.find('.author-info').html()
						) +
					'</p>' +
					ZhihuArticleGenerator.processHTML(
						$item.find('textarea.content').val()
					)
				)
			} else {
				return null
			}
		}
	}

	ZhihuArticleGenerator.processHTML = function (html) {
		var regNoscript = /\<noscript\>[^<]*\<\/noscript\>/g
		var regImg = /\<img [^>]*(data-original|data-actualsrc)=(\S+)[^>]*\>/g
		return html
		.replace(regNoscript, '')
		.replace(regImg, function (m, attr, src) {
			return '<img src=' + src + '>'
		})
	}

	ZhihuArticleGenerator.getReadingItemOnIndexPage = function () {
		return this.findReadingElement('.zm-item-expanded')
	}

	ZhihuArticleGenerator.getReadingItemOnQuestionPage = function () {
		return this.findReadingElement('.zm-item-answer')
	}

	ZhihuArticleGenerator.findReadingElement = function (selector) {
		var $items =  $(selector)
		var item
		var i = 0
		while ((item = $items[i++])) {
			if (this.isElementInReading(item)) {
				return $(item)
			}
		}
		return null
	}

	ZhihuArticleGenerator.isElementInReading = function (el) {
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



	/*
	 * FocusReadingPad
	 * 文章阅读面板
	 *
	 * require:
	 * - jquery
	 * - FocusReadingLinkTip
	 */

	var FocusReadingPad = {}

	FocusReadingPad.init = function () {
		this.$readingPad = $(this.TEMPLATE_PAD).hide().appendTo('body')
		this.$readingPad.on('click', '#focus-reading-pad-close-button', this.hide.bind(this))
	}

	FocusReadingPad.TEMPLATE_PAD = (
		'<div id="focus-reading-pad">' +
			'<a id="focus-reading-pad-close-button">×</a>' +
			'<div id="focus-reading-pad-content"></div>' +
		'</div>'
	)
	FocusReadingPad.CLASS_READING_PAD_SHOWING = 'focus-reading'

	FocusReadingPad.show = function (title, content) {
		this.$readingPad.find('#focus-reading-pad-content').html(
			'<h1>' + title + '</h1>' +
			content
		)
		this.$readingPad.show()
		$('html,body').addClass(this.CLASS_READING_PAD_SHOWING)
		$(document).on('keydown', this._hideOnEscKeydown)

		// everytime show pad, focus at the start
		this.$readingPad.animate({'scrollTop': 0}, 500)
	}

	FocusReadingPad.hide = function () {
		this.$readingPad.hide()
		$('html,body').removeClass(this.CLASS_READING_PAD_SHOWING)
		$(document).off('keydown', this._hideOnEscKeydown)
		FocusReadingLinkTip.start()
	}

	FocusReadingPad._hideOnEscKeydown = function (e) {
		if (e.keyCode === 27) {
			FocusReadingPad.hide()
		}
	}



	/*
	 * FocusReadingLinkTip
	 * 跟踪鼠标在页面有效链接上的停留，显示“专注阅读”，以便在打开的页面中直接启用阅读模式
	 *
	 * require:
	 * - jquery
	 */

	var FocusReadingLinkTip = {}

	FocusReadingLinkTip.init = function () {
		var lazyTimer = null
		var $link = null
		$(document).on('mouseenter mouseleave', 'a', function (e) {
			if (FocusReadingLinkTip._enabled) {
				if (e.type === 'mouseleave' || lazyTimer) {
					clearTimeout(lazyTimer)
					lazyTimer = null
					$link = null
				} else {
					$link = $(e.currentTarget)
					var url = $link.attr('href')
					if (
						url &&
						!(url.startsWith('#') || url.startsWith('javascript')) &&
						$link.find('.focus-reading-tip-for-link').length === 0
					) {
						lazyTimer = setTimeout(function () {
							$link.prepend(FocusReadingLinkTip._makeFocusReadingTip(
								FocusReadingLinkTip._addFocusReadingTagToUrl($link.attr('href'))
							))
						}, 100)
					}
				}
			} else {
				clearTimeout(lazyTimer)
				lazyTimer = null
				$link = null
			}
		}).on('click', '.focus-reading-tip-for-link', function (e) {
			var url = $(e.currentTarget).attr('data-url')
			if (url) {
				window.open(url, 'focus-reading-window')
			}
			e.preventDefault()
		})
	}

	FocusReadingLinkTip.start = function () {
		this._enabled = true
	}

	FocusReadingLinkTip.stop = function () {
		this._enabled = false
	}

	FocusReadingLinkTip._makeFocusReadingTip = function (url) {
		return (
		'<span class="focus-reading-tip-for-link" data-url="' + url + '">' +
			'专注阅读' +
		'</span>'
		)
	}

	FocusReadingLinkTip._addFocusReadingTagToUrl = function (url) {
		var rest = url
		var search
		var hash

		var hashIndex = rest.indexOf('#')
		if (hashIndex > -1) {
			hash = rest.substr(hashIndex)
			rest = rest.substr(0, hashIndex)
		} else {
			hash = ''
		}

		var searchIndex = rest.indexOf('?')
		if (searchIndex > -1) {
			search = rest.substr(searchIndex)
			rest = rest.substr(0, searchIndex)
		} else {
			search = ''
		}

		return rest + (search.length > 0 ? search + '&focus-reading=true' : '?focus-reading=true') + hash
	}



	/*
	 * main process
	 *
	 * require:
	 * - jquery
	 * - ArticleGeneratorManager
	 * - FocusReadingPad
	 * - FocusReadingLinkTip
	 */

	var TEMPLATE_BUTTON = (
		'<button id="focus-reading-button" title="Focus Reading">FR</button>'
	)

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

		ArticleGeneratorManager.init()
		FocusReadingPad.init()
		FocusReadingLinkTip.init()

		/*
		 * 自动进入专注阅读模式
		 */
		if (location.search.indexOf('focus-reading=true') > 0) {
			focusRead()
		} else {
			FocusReadingLinkTip.start()
		}
	}

	function focusRead() {
		var article = ArticleGeneratorManager.generatArticle()
		if (article) {
			FocusReadingPad.show(article.title, article.content)
			FocusReadingLinkTip.stop()
		} else {
			alert('Focus Reading: Can not find anything to read.')
		}
	}

	tryInit()
})()