'use strict';

module.exports = function (grunt) {

    // Time Tasks
    require('time-grunt')(grunt);
    // Load Grunt Tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        // Paths
        yeoman: {
            app: 'app',
            dist: 'dist'
        },
        watch: {<% if (cssPre === 'sass' || cssPre === 'compass') { %>
            <%= cssPre %>: {
                files: ['<%%= yeoman.app %>/<%= sassPre %>/**/*.{scss,sass}'],
                tasks: ['<%= cssPre %>:server'<% if (autoPre) { %>, 'autoprefixer:server'<% } %>]
            },
            autoprefixer: {
                files: ['<%%= yeoman.app %>/<%= cssDir %>/**/.css'],
                tasks: ['copy:stageCss', 'autoprefixer:server']
            },
            livereload: {
                options: {
                    livereload: '<%%= connect.options.livereload %>'
                },
                files: [
                    <% if (autoPre) { %>
                    '.tmp/<%= cssDir %>/**/*.css',<% } else { %>
                    '{.tmp,<%%= yeoman.app %>}/<%= cssDir %>/**/*.css',<% } %>
                    '{.tmp,<%%= yeoman.app %>}/<%= jsDir %>/**/*.js',
                    '<%%= yeoman.app %>/<%= imgDir %>/**/*/.{gif,jpg,jpeg,png,webp,svg}'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%%= yeoman.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    open: true,
                    base: [
                        '<%%= yeoman.dist %>'
                    ]
                }
            },
            test: {
                options: {
                    base: [
                        '.tmp',
                        'test',
                        '<%%= yeoman.app %>'
                    ]
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%%= yeoman.dist %>/*'
                    ]
                }],
            },
            server: [
                '.tmp'
            ]
        }, <% if (cssPre === 'sass') { %>
        sass: {
            options: {
                bundleExec: true,
                debugInfo: false,
                lineNumbers: false,
                loadPath: 'app/_bower'
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%%= yeoman.app %>/<%= sassDir %>',
                    src: '**/*.{scss,sass}',
                    dest: '.tmp/<%= cssDir %>',
                    ext: '.css'
                }]
            },
            server: {
                options: {
                    debugInfo: true,
                    lineNumbers: true
                },
                files: [{
                    expand: true,
                    cwd: '<%%= yeoman.app %>/<%= sassDir %>',
                    src: '**/*.{scss,sass}',
                    dest: '.tmp/<%= cssDir %>',
                    ext: '.css'
                }]
            }
        }, <% } %><% if (cssPre === 'compass') { %>
        compass: {
            options: {
                bundleExec: true,
                sassDir: '<%%= yeoman.app %>/<%= sassDir %>',
                cssDir: '.tmp/<%%= cssDir %>',
                imagesDir: '<%%= yeoman.app %>/<%= imgDir %>',
                javascriptDir: '<%%= yeoman.app %>/<%= jsDir %>',
                relativeAssets: false,
                httpImagesPath: '/<%= imgDir %>',
                httpGeneratedImagesPath: '/<%= imgDir %>/generated',
                outputStyle: 'expand',
                raw: 'extensions_dir = "<%%= yeoman.app %>/_bower"\n'
            },
            dist: {
                options: {
                    generatedImagesDir: '<%%= yeoman.dist %>/<%= imgDir %>/generated'
                }
            },
            server: {
                options: {
                    debugInfo: true,
                    generatedImagesDir: '.tmp/<%= imgDir %>/generated'
                }
            }
        },<% } %><% if (autoPre) { %>
        autoprefixer: {
            options: {
                browsers: ['last 2 versions']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%%= yeoman.dist %>/<%= cssDir %>',
                    src: '**/*.css',
                    dest: '<%%= yeoman.dist %>/<%= cssDir %>'
                }]
            },
            server: {
                files: [{
                    expand: true,
                    cwd: '.tmp/<%= cssDir %>',
                    src: '**/*.css',
                    dest: '.tmp/<%= cssDir %>'
                }]
            }
        },
        useminPrepare: {
            options: {
                dest: '<%%= yeoman.dist %>'
            },
            html: '<%%= yeoman.dist %>/index.html'
        },
        usemin: {
            options: {
                assetsDir: '<%%= yeoman.dist %>',
            },
            html: ['<%%= yeoman.dist %>/**/*.html'],
            css: ['<%%= yeoman.dist %>/<%= cssDir %>/**/*.css']
        },
        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributesQuotes: false,
                    removeRedundantAttributes: true
                },
                files: [{
                    expand: true,
                    cwd: '<%%= yeoman.dist %>',
                    src: '**/*.html',
                    dest: '<%%= yeoman.dist %>'
                }]
            }
        },
        cssmin: {
            dist: {
                options: {
                    check: 'gzip'
                }
            }
        },
        imagemin: {
            dist: {
                options: {
                    progressive: true
                },
                files: [{
                    expand: true,
                    cwd: '<%%= yeoman.dist %>',
                    src: '**/*.{jpg,jpeg,png}',
                    dest: '<%%= yeoman.dist %>'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%%= yeoman.dist %>',
                    src: '**/*.svg',
                    dest: '<%%= yeoman.dist %>'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%%= yeoman.app %>',
                    dest: '<%%= yeoman.dist %>'
                }]
            }<% if (autoPre) { %>,
            stageCss: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%%= yeoman.app %>/<%= cssDir %>',
                    src: '**/*.css',
                    dest: '.tmp/<%= cssDir %>'
                }]
            }<% } %>
        },
        filerev: {
            options: {
                length: 4
            },
            dist: {
                files: [{
                    src: [
                        '<%%= yeoman.dist %>/<%= jsDir %>/**/*.js',
                        '<%%= yeoman.dist %>/<%= cssDir %>/**/*.css',
                        '<%%= yeoman.dist %>/<%= imgDir %>/**/*.{gif,jpg,jpeg,png,svg,webp}',
                        '<%%= yeoman.dist %>/<%= fontsDir %>/**/*.{eot*,otf,svg,ttf,woff}'
                    ]
                }]
            }
        },
        jshint: {
            options: {
                jshint: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%%= yeoman.app %>/<%= jsDir %>/**/*.js',
                // 'test/spec/**/*.js'
            ]
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            check: {
                src: [
                    '<%%= yeoman.app %>/<%= cssDir %>/**/*.css'
                ]
            }
        },
        concurrent: {
            server: [<% if (cssPre === 'sass') { %>
                'sass:server',<% } %><% if (cssPre === 'compass') { %>
                'compass:server',<% } %><% if (autoPre) { %>
                'copy:stageCss',<% } %>
            ],
            dist: [<% if (cssPre === 'sass') { %>
                'sass:dist',<% } %><% if (cssPre === 'compass') { %>
                'compass:dist',<% } %>
                'copy:dist'
            ]
        }
    });

    // Tasks
    grunt.registerTask('server', function () {
        grunt.log.warn('A task `server` não é mais utilizada. Use `grunt serve`');
        grunt.task.run(['serve']);
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',<% if (autoPre) { %>
            'autoprefixer:server',<% } %>
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        // TODO!!!!!!
    ]);

    grunt.registerTask('check', [
        'clean:server',<% if (cssPre === 'sass') { %>
        'sass:server',<% } %><% (cssPre === 'compass') { %>
        'compass:server',
        'jshint:all',
        'csslint:check'
    ]);

};