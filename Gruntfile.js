module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    typescript: {
      base: {
        src: ['src/**/*.ts'],
        options: {
          target: 'es3',
          sourceMap: true,
        }
      }
    },
  });
  
  grunt.loadNpmTasks('grunt-typescript');
  grunt.registerTask('default', ['typescript']);
};