module.exports = function (grunt) {

	grunt.initConfig({
		browserify: {
			build: {
				src: 'src/main.js',
				dest: 'extension/main.js'
			}
		},
		less: {
			build: {
				src: 'src/main.less',
				dest: 'extension/main.css'
			}
		}
	})

	grunt.loadNpmTasks('grunt-browserify')
	grunt.loadNpmTasks('grunt-contrib-less')

	grunt.registerTask('default', ['browserify:build', 'less:build'])
}