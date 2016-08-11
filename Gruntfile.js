module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        ts: {
            default : {
                src: ["src/script/ts/**/*.ts", "!node_modules/**"],
                dest: "src/script/script.js"
            }
        }
    });

    grunt.loadNpmTasks('grunt-ts');
    grunt.registerTask('default', ['ts']);
};