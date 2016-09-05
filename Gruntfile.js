module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

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
                    'src/style/style.css': "src/style/style.scss"
                }
            }
        },
        
        inline: {
            dist: {
                options: {
                    inlineTagAttributes: {
                        js: 'data-inlined="true"',
                        css: 'data-inlined="true"'
                    },
                    uglify: true,
                    cssmin: true,
                },
                src: "src/index.html",
                dest: "src/PokeEase.html"
            }
        },

        watch: {
            sass: {
                files: ["**/*.scss"],
                tasks: ["sass"],
                options: {
                spawn: false,
                },
            },
            ts: {
                 files: ["**/*.ts","**/**/*.ts","**/**/**/*.ts","**/**/**/**/*.ts"],
                    tasks: ["ts"],
                    options: {
                    spawn: false,
                },
            }
        },
    });

    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-sass");
    grunt.loadNpmTasks("grunt-inline");
    grunt.registerTask("build", ["ts", "sass"]);
    grunt.registerTask("dist", ["build", "inline"]);
    grunt.registerTask("default", ["build", "watch"]);
};
