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
        watch: {<% if (cssPree === 'sass' || cssPre === 'compass') { %>
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
    })

};