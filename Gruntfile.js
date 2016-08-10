module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    typescript: {
      base: {
        src: ['src/**/*.ts'],
		//dest: "src/script/script.js",
        options: {
          target: 'es3',
          sourceMap: true,
		  watch: 'src/script'
        }
      }
    },
  });
  
  grunt.loadNpmTasks('grunt-typescript');
  grunt.registerTask('default', ['typescript']);
};