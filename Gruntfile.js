module.exports = function (grunt) {

	grunt.initConfig({
		browserify: {
			content: {
				src: 'src/content.js',
				dest: 'extension/content.js'
			},
			background: {
				src: 'src/background.js',
				dest: 'extension/background.js'
			}
		},
		less: {
			content: {
				src: 'src/content.less',
				dest: 'extension/content.css'
			}
		}
	})

	grunt.loadNpmTasks('grunt-browserify')
	grunt.loadNpmTasks('grunt-contrib-less')

	grunt.registerTask('default', ['browserify', 'less'])
}