$(function () {
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

	function focusRead() {
		var content = $('.Mid2L_con').html();
		if (content) {
			$('html,body').addClass('focus-reading');
			$('#focus-reading-pad-content').html(content);
			$('#focus-reading-pad').show();
		} else {
			alert('Can not find anything to read.')
		}
	}
})