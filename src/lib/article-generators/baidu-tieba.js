/*
 * BaiduTiebaArticleGenerator
 * 用于百度贴吧的内容生成器
 */

var $ = require('jquery')

var BaiduTiebaArticleGenerator = {}

BaiduTiebaArticleGenerator.name = 'tieba.baidu'

BaiduTiebaArticleGenerator.title = '.core_title_txt'

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

module.exports = BaiduTiebaArticleGenerator