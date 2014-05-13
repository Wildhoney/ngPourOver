module.exports = function(grunt) {

    grunt.initConfig({

        /**
         * @property pkg
         * @type {Object}
         */
        pkg: grunt.file.readJSON('package.json'),

        /**
         * @property jshint
         * @type {Object}
         */
        jshint: {
            all: 'module/ngPourOver.js',
            options: {
                jshintrc: '.jshintrc'
            }
        },

        /**
         * @property uglify
         * @type {Object}
         */
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> by <%= pkg.author %> created on <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: ['module/ngPourOver.js'],
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },

        /**
         * @property copy
         * @type {Object}
         */
        copy: {
            main: {
                files: [
                    { flatten: true, src: ['module/ngPourOver.js'], dest: 'dist/ng-pourover.js' }
                ]
            },
            test: {
                src: 'module/ngPourOver.js',
                dest: 'example/js/vendor/ng-pourover/ng-pourover.js'
            },
            release: {
                src: 'releases/<%= pkg.version %>.zip',
                dest: 'releases/master.zip'
            }

        },

        /**
         * @property compress
         * @type {Object}
         */
        compress: {
            main: {
                options: {
                    archive: 'releases/<%= pkg.version %>.zip'
                },
                files: [
                    { flatten: true, src: ['dist/**'], dest: './', filter: 'isFile' }
                ]
            }
        },

        /**
         * @property jasmine
         * @type {Object}
         */
        jasmine: {
            pivotal: {
                src: 'module/ngPourOver.js',
                options: {
                    specs: 'tests/spec.js',
                    helpers: [
                        'example/js/vendor/angular/angular.js',
                        'example/js/vendor/underscore/underscore.js',
                        'example/js/vendor/pourover/pourover.js',
                        'example/js/vendor/angular-mocks/angular-mocks.js'
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('build', ['copy', 'uglify', 'compress', 'copy']);
    grunt.registerTask('test', ['jasmine', 'jshint']);
    grunt.registerTask('default', ['jshint', 'jasmine', 'compress', 'copy', 'uglify']);

};