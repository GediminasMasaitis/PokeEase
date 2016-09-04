module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        ts: {
            default: {
                src: ["src/script/ts/**/*.ts", "!node_modules/**"],
                dest: "src/script/script.js"
            }
        },

        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'src/style/style.css': 'src/style/style.scss'
                }
            }
        },
        watch: {
            sass: {
                files: ['**/*.scss'],
                tasks: ['sass'],
                options: {
                spawn: false,
                },
            },
            ts: {
                 files: ['**/*.ts','**/**/*.ts','**/**/**/*.ts','**/**/**/**/*.ts'],
                    tasks: ['ts'],
                    options: {
                    spawn: false,
                },
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-sass');
    grunt.registerTask('default', ['ts', 'sass','watch']);
};
