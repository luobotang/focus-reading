(function () {

	tryInit();

	// init as soon as possible
	// even before document ready
	function tryInit() {
		if (document.body) {
			init();
		} else {
			setTimeout(tryInit, 100);
		}
	}

	function init() {
		var $button = $(
			'<button id="focus-reading-button">' +
				'Focus Reading' +
			'</button>'
		).appendTo('body');
		$button.on('click', focusRead);

		$('body').append(
			'<div id="focus-reading-pad" style="display:none;">' +
				'<a id="focus-reading-pad-close-button">×</a>' +
				'<div id="focus-reading-pad-content">' +
				'</div>' +
			'</div>'
		);

		$(document).on('click', '#focus-reading-pad-close-button', function () {
			$('#focus-reading-pad').hide();
			$('html,body').removeClass('focus-reading');
		});
	}

	function focusRead() {
		var content = getContent();
		if (content) {
			$('html,body').addClass('focus-reading');
			$('#focus-reading-pad-content').html(content);
			$('#focus-reading-pad').show();
		} else {
			alert('Can not find anything to read.')
		}
	}

	function getContent() {
		var content = ContentGenerator.generatorContent();
		if (content) {
			return (
				'<h1>' + content.title + '</h1>' +
				content.content
			);
		} else {
			return null;
		}
	}

	var ContentGenerator = {};

	ContentGenerator.generators = [];

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
	};

	ContentGenerator.generatorContent = function () {
		var siteGenerator;
		var hostname = location.hostname;
		for (var i = 0, len = this.generators.length; i < len; i++) {
			siteGenerator = this.generators[i];
			if (siteGenerator.match(hostname)) {
				return {
					title: siteGenerator.title(),
					content: siteGenerator.content()
				};
			}
		}
		return null;
	}

	// all site generators
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
			}).join('');
		}
	})

	function hasName(hostname) {
		return hostname.indexOf(this.name) > -1;
	}

	function getH1Text() {
		return $('h1').text();
	}

	function getText(el) {
		return function () {
			return $(el).text();
		}
	}

	function getHtml(el) {
		return function () {
			return $(el).html();
		}
	}
})()