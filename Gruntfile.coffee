# Generated on 2014-07-26 using generator-reveal 0.3.7
module.exports = (grunt) ->

    grunt.initConfig
        repo: 'git@github.com:banderson/reactive-component-ui-presentation.git'

        watch:

            livereload:
                options:
                    livereload: true
                files: [
                    'index.html'
                    'slides/*.md'
                    'slides/*.html'
                    'js/*.js',
                    'css/*.css'
                ]

            index:
                files: [
                    'templates/_index.html'
                    'templates/_section.html'
                    'slides/list.json'
                ]
                tasks: ['buildIndex']

            coffeelint:
                files: ['Gruntfile.coffee']
                tasks: ['coffeelint']

            jshint:
                files: ['js/*.js']
                tasks: ['jshint']

        connect:

            livereload:
                options:
                    port: 9099
                    # Change hostname to '0.0.0.0' to access
                    # the server from outside.
                    hostname: 'localhost'
                    base: '.'
                    open: true
                    livereload: true

        coffeelint:

            options:
                indentation:
                    value: 4

            all: ['Gruntfile.coffee']

        jshint:

            options:
                jshintrc: '.jshintrc'

            all: ['js/*.js']

        copy:

            dist:
                files: [{
                    expand: true
                    src: [
                        'slides/**'
                        'bower_components/**'
                        'js/**'
                    ]
                    dest: 'dist/'
                },{
                    expand: true
                    src: ['index.html']
                    dest: 'dist/'
                    filter: 'isFile'
                }]


        buildcontrol:

            options:
                dir: 'dist'
                commit: true
                push: true
                message: 'Built from %sourceCommit% on branch %sourceBranch%'
            pages:
                options:
                    remote: "<%= repo %>"
                    branch: 'gh-pages'



    # Load all grunt tasks.
    require('load-grunt-tasks')(grunt)

    grunt.registerTask 'buildIndex',
        'Build index.html from templates/_index.html and slides/list.json.',
        ->
            indexTemplate = grunt.file.read 'templates/_index.html'
            sectionTemplate = grunt.file.read 'templates/_section.html'
            slides = grunt.file.readJSON 'slides/list.json'

            html = grunt.template.process indexTemplate, data:
                slides:
                    slides
                section: (slide) ->
                    grunt.template.process sectionTemplate, data:
                        slide:
                            slide
            grunt.file.write 'index.html', html

    grunt.registerTask 'test',
        '*Lint* javascript and coffee files.', [
            'coffeelint'
            'jshint'
        ]

    grunt.registerTask 'server',
        'Run presentation locally and start watch process (living document).', [
            'buildIndex'
            'connect:livereload'
            'watch'
        ]

    grunt.registerTask 'dist',
        'Save presentation files to *dist* directory.', [
            'test'
            'buildIndex'
            'copy'
        ]


    grunt.registerTask 'deploy',
        'Deploy to Github Pages', [
            'dist'
            'buildcontrol'
        ]


    # Define default task.
    grunt.registerTask 'default', [
        'test'
        'server'
    ]
