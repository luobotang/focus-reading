var ArticleGeneratorManager = require('../article-generator-manager')
var BaiduTiebaArticleGenerator = require('./baidu-tieba.js')
var ZhihuArticleGenerator = require('./zhihu.js')

exports.registerAll = function () {
	ArticleGeneratorManager
		.add('gamersky.com', 'h1', '.Mid2L_con')
		.add('movie.douban', 'h1', '#link-report')
		.add('baike.baidu', 'h1', '.main-content')
		.add('jianshu.com', 'h1.title', '.show-content')
		.add('guancha.cn', '.content-title1', '.all-txt')
		.add('tuicool.com', 'h1', '.article_body')
		.add('chinanews.com', 'h1', '.left_zw')
		.add('xinhuanet.com', '#title', '.article')
		.add('21ccom.net', 'h4', '#contents')
		.add('chinavalue.net', '.ArticleTitle', '.ArticleContent')
		.add('dajia.qq.com', 'h1', '#content, #articleContent')
		.add('news.163.com', '#h1title', '#endText')
		.add('tech.163.com', 'h1', '#endText')
		.add('udpwork.com', '#rss_item h2:first', '#rss_item .content')
		.add('36kr.com', 'h1', '.article')
		.add(BaiduTiebaArticleGenerator)
		.add(ZhihuArticleGenerator)
}