(function () {

	tryInit();

	function tryInit() {
		try {
			if (document.body) {
				init();
			} else {
				throw new Error('document not ready');
			}
		} catch (e) {
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
		var site = location.hostname;
		if (site.indexOf('gamersky') > -1) {
			return $('.Mid2L_con').html();
		} else if (site.indexOf('movie.douban') > -1) {
			return (
				'<h1>' + $('h1').text() + '</h1>' +
				$('#link-report').html()
			);
		} else if (site.indexOf('jianshu') > -1) {
			return (
				'<h1>' + $('h1.title').text() + '</h1>' +
				$('.show-content').html()
			);
		} else if (site.indexOf('baike.baidu') > -1) {
			return (
				'<h1>' + $('h1').text() + '</h1>' +
				$('.main-content').html()
			);
		} else if (site.indexOf('tieba.baidu') > -1) {
			return (
				'<h1>' + $('h1').text() + '</h1>' +
				[].map.call($('.d_post_content'), function (content) {
					return (
					'<section>' + 
						content.innerHTML +
					'</section>'
					);
				}).join('')
			);
		} else {
			return null;
		}
	}
})()