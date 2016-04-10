module.exports = function (grunt) {

    grunt.initConfig({

        meta: {
            jsFiles: ['client/app/**/*.js', 'test/unit/**/*.js', 'server/**/*.js']
        },
        watch: {
            styles: {
                files: ["client/app/less/*"],
                tasks: "less:development",
                options: {
                   livereload: true // port 35729
                },
            }
        },

        less: {
            development: {
                options: {
                    paths: ["client/app/less/*"]
                },
                files: {
                    "client/app/expense-tracker.css": "client/app/less/index.less"
                }
              },
              production: {
                options: {
                    paths: ["client/app/less/*"],
                    yuicompress: true
                },
                files: {
                    "client/app/expense-tracker.css": "client/app/less/index.less"
                }
              }
        },

    	jshint: {
            files: '<%= meta.jsFiles %>',
            options: {
                jshintrc: 'jshintrc'
            }
        },

    	jscs: {
            src: '<%= meta.jsFiles %>',
            options: {
               requireSpaceAfterKeywords: [ "if", "else", "for", "while", "do", "switch", "return", "try" ],
               requireSpacesInFunctionExpression: {beforeOpeningCurlyBrace: true},
               requireSpacesInAnonymousFunctionExpression: {beforeOpeningCurlyBrace: true},
               disallowSpacesInsideParentheses: true,
               requireSpaceBeforeBinaryOperators: ["+", "-", "/", "*", "=", "==", "===", "!=", "!=="],
               requireSpaceAfterBinaryOperators: ["+", "-", "/", "*", "=", "==", "===", "!=", "!=="],
               requireSpaceBeforeBlockStatements: true
            }
        },

    	karma: {
            unit: {
                configFile: 'test/karma.conf.js'
            }
        },

        ngAnnotate: {
            app: {
                files: {
                    'client/app/expense-tracker.annotated.js': ['client/app/**/*.js']
                }
            }
        },

        uglify: {
            options: {
                mangle: false
            },
            app: {
                files: {
                    'dist/js/expense-tracker.min.js': ['client/app/expense-tracker.annotated.js']
                }
            }
        },
        cssmin: {
            options: {
            },
            app: {
                files: [{
                    expand: false,
                    src: ['client/app/expense-tracker.css'],
                    dest: 'dist/css/expense-tracker.min.css'
                },{
                    expand: false,
                    src: ['client/lib/**/*.css'],
                    dest: 'dist/css/vendor.min.css'
                }]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs-checker');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask("dev", ["less:development", "watch:styles"]);
    grunt.registerTask("check", ["jshint", "jscs"]);
    grunt.registerTask("test", ["karma"]);
    grunt.registerTask("build", ["ngAnnotate", "uglify", "less:production", "cssmin"]);

    // The default task will show the usage
    grunt.registerTask("default", "Prints usage", function () {
        grunt.log.writeln("");
        grunt.log.writeln("Expense Tracker front-end development");
        grunt.log.writeln("-------------------------------------");
        grunt.log.writeln("");
        grunt.log.writeln("* run 'grunt --help' to get an overview of all commands.");
        grunt.log.writeln("* run 'grunt dev' to build while developing.");
    });

};
