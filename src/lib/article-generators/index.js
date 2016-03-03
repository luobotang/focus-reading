var $ = require('jquery')

/*
 * @param {ArticleGeneratorManager} articleGeneratorManager
 */
exports.registerAllTo = function (articleGeneratorManager) {
	articleGeneratorManager
		.add('gamersky.com', 'h1', '.Mid2L_con')
		.add('movie.douban', 'h1', '#link-report')
		.add('guancha.cn', '.content-title1', '.all-txt')
		.add('chinanews.com', 'h1', '.left_zw')
		.add('21ccom.net', 'h4', '#contents')
		.add('udpwork.com', '#rss_item h2:first', '#rss_item .content')
		.add('blog.163.com', 'h3.title', '.nbw-blog')
		.add('www.cnblogs.com', '.postTitle', '#cnblogs_post_body')
		.add('news.ifeng.com', 'h1', '.AtxtType01')
		.add('huxiu.com', 'h1', function () {
			return $('.article-img-box').html() + $('#article_content').html()
		})

		.add(require('./baidu-tieba.js'))
		.add(require('./zhihu.js'))
		.add(require('./bitauto'))
		.add(require('./haodf'))
		.add(require('./tianya'))

		/* 较为通用的获取模式改用 common */
		.add(require('./common'))
}