module.exports = function(grunt) {
    var $config             = grunt.file.readJSON('config.json');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bootstrap   :  $config.bootstrap,
        fontawesome :  $config.fontawesome,
        banner      :{
            main        : $config.banner.join("\n"),
            bootstrap   : $config.bootstrap.banner.join('\n'),
            fontawesome : $config.fontawesome.banner.join('\n')
        },
        usebanner: {
            dist: {
                options: {
                    position: 'top',
                    banner: '<%= banner.main %>'
                },
                files: {
                    src: [ 'css/*.min.css','../../../plugins/system/jvisualcontent/css/jmedia.min.css' ]
                }
            },
            bootstrap: {
                options: {
                    position: 'top',
                    banner: '<%= banner.bootstrap %>'
                },
                files: {
                    src: [ 'dist/css/<%= bootstrap.name %>.min.css' ]
                }
            },
            fontawesome: {
                options: {
                    position: 'top',
                    banner: '<%= banner.fontawesome %>'
                },
                files: {
                    src: [ 'dist/css/<%= fontawesome.name %>.min.css' ]
                }
            },
            front_end: {
                options: {
                    position: 'top',
                    banner: '<%= banner.main %>'
                },
                files: {
                    src: [ '../../../components/com_jvisualcontent/css/jvisualcontent.min.css' ]
                }
            }
        },
        uglify: {
            //all_files: {
            //    files: [{
            //        expand: true,
            //        cwd: 'sources/js',
            //        src: '**/*.js',
            //        dest: 'dist/js',
            //        ext: '.min.js'
            //    }]
            //},
            some_files: {
                files: {
                    'js/general-tree.min.js': 'sources/js/general-tree.js',
                    'js/jvisualcontent-bootstrap3-conflict.min.js': 'sources/js/jvisualcontent-bootstrap3-conflict.js',
                    'js/jquery-ui-conflict.min.js': 'sources/js/jquery-ui-conflict.js',
                    'js/jvisualcontent.min.js': 'sources/js/jvisualcontent.js',
                    'js/jvisualcontent-shortcode.min.js': 'sources/js/jvisualcontent-shortcode.js',
                    'js/libs.min.js': 'sources/js/libs.js',
                    'js/shortcode-tree.min.js': 'sources/js/shortcode-tree.js',
                    'js/spectrum.min.js': 'sources/js/spectrum.js',
                    'js/tz-shortcode.min.js': 'sources/js/tz-shortcode.js',
                    'js/tztype.min.js': 'sources/js/tztype.js'
                }
            },
            libraries:{
                    files: [{
                        expand: true,
                        cwd: 'sources/js/libraries',
                        src: '*.js',
                        dest: 'js',
                        ext: '.min.js'
                    }]
            },
            bootstrap:{
                options: {
                    //preserveComments: 'some'
                    banner: '<%= banner.bootstrap %>'
                },
                files:{
                    'js/<%= bootstrap.name %>.min.js': 'dist/js/<%= bootstrap.name %>.js'
                }
            },
            bootstrap_front_end:{
                options: {
                    //preserveComments: 'some'
                    banner: '<%= banner.bootstrap %>'
                },
                files:{
                    '../../../components/com_jvisualcontent/js/<%= bootstrap.name %>.min.js': 'dist/js/<%= bootstrap.name %>.js',
                    '../../../components/com_jvisualcontent/js/jvisualcontent-bootstrap3-conflict.min.js': 'sources/js/jvisualcontent-bootstrap3-conflict.js'
                }
            }
        },
        less: {
            bootstrap:{
                options:{
                    banner: "<%= banner.bootstrap %>"
                },
                files:{
                    'dist/css/<%= bootstrap.name %>.css': "sources/less/libraries/jvisualcontent_bootstrap-3.3.4/bootstrap.less"
                }
            },
            fontawesome:{
                files:{
                    'dist/css/<%= fontawesome.name %>.css': "<%= fontawesome.src_path %>font-awesome.less"
                }
            },
            libraries:{
                files:{
                    'dist/css/jquery-ui.css': "sources/less/libraries/jquery-ui.less",
                    'dist/css/spectrum.css': "sources/less/libraries/spectrum.less"
                }
            },
            admin: {
                files:{
                    'dist/css/jvisualcontent-admin.css': "sources/less/jvisualcontent-admin.less"
                }
            }
        },
        cssmin: {
            target: {
                options: {
                    // TODO disable `zeroUnits` optimization once clean-css 3.2 is released
                    //    and then simplify the fix for https://github.com/twbs/bootstrap/issues/14837 accordingly
                    compatibility: 'ie8',
                    keepSpecialComments: false,
                    advanced: false
                },
                files: {
                    'css/jvisualcontent-admin.min.css': 'dist/css/jvisualcontent-admin.css'
                }
            },
            bootstrap:{
                options: {
                    // TODO: disable `zeroUnits` optimization once clean-css 3.2 is released
                    //    and then simplify the fix for https://github.com/twbs/bootstrap/issues/14837 accordingly
                    compatibility: 'ie8',
                    keepSpecialComments: false
                },
                files: {
                    'dist/css/<%= bootstrap.name %>.min.css': 'dist/css/<%= bootstrap.name %>.css'
                }
            },
            fontawesome:{
                options: {
                    // TODO: disable `zeroUnits` optimization once clean-css 3.2 is released
                    //    and then simplify the fix for https://github.com/twbs/bootstrap/issues/14837 accordingly
                    compatibility: 'ie8',
                    keepSpecialComments: false
                },
                files: {
                    'dist/css/<%= fontawesome.name %>.min.css': 'dist/css/<%= fontawesome.name %>.css'
                }
            },
            libraries:{
                options: {
                    // TODO: disable `zeroUnits` optimization once clean-css 3.2 is released
                    //    and then simplify the fix for https://github.com/twbs/bootstrap/issues/14837 accordingly
                    compatibility: 'ie8',
                    keepSpecialComments: '*'
                },
                files: {
                    'dist/css/jquery-ui.min.css': 'dist/css/jquery.css',
                    'dist/css/spectrum.min.css': 'dist/css/spectrum.css'
                }
            },
            plugin: {
                options: {
                    // TODO: disable `zeroUnits` optimization once clean-css 3.2 is released
                    //    and then simplify the fix for https://github.com/twbs/bootstrap/issues/14837 accordingly
                    compatibility: 'ie8',
                    keepSpecialComments: '*',
                    advanced: false
                },
                files: [{
                    expand: true,
                    cwd: 'dist/css',
                    src: ['jmedia.css'],
                    dest: '../../../plugins/system/jvisualcontent/css',
                    ext: '.min.css'
                }]
            },
            front_end:{
                options: {
                    // TODO: disable `zeroUnits` optimization once clean-css 3.2 is released
                    //    and then simplify the fix for https://github.com/twbs/bootstrap/issues/14837 accordingly
                    compatibility: 'ie8',
                    keepSpecialComments: false
                },
                files: {
                    '../../../components/com_jvisualcontent/css/jvisualcontent.min.css': 'dist/css/jvisualcontent.css'
                }
            }
        },
        cssUrlRewrite: {
            dist: {
                src: "css/layout-admin.min.css",
                dest: "css/output.css",
                options: {
                    skipExternal: true,
                    rewriteUrl: function(url, options, dataURI) {
                        return url.replace(/^dist\//, '../');
                    }
                }
            }
        },
        csslint: {
            options: {
                csslintrc: 'sources/less/.csslintrc'
            },
            all: ['dist/css/*.css','!dist/css/spectrum.css']
        },
        jshint: {
            all: ['sources/js/*.js']
        },
        concat: {
            options: {
                banner: '<%= banner.bootstrap %>\n',
                stripBanners: true
            },
            bootstrap: {
                src: [
                    '<%= bootstrap.src_js_path %>transition.js',
                    '<%= bootstrap.src_js_path %>alert.js',
                    '<%= bootstrap.src_js_path %>button.js',
                    '<%= bootstrap.src_js_path %>carousel.js',
                    '<%= bootstrap.src_js_path %>collapse.js',
                    '<%= bootstrap.src_js_path %>dropdown.js',
                    '<%= bootstrap.src_js_path %>modal.js',
                    '<%= bootstrap.src_js_path %>tooltip.js',
                    '<%= bootstrap.src_js_path %>popover.js',
                    '<%= bootstrap.src_js_path %>scrollspy.js',
                    '<%= bootstrap.src_js_path %>tab.js',
                    '<%= bootstrap.src_js_path %>affix.js'
                ],
                dest: 'dist/js/<%= bootstrap.name %>.js'
            },
            front_end: {
                src: [
                    'dist/css/<%= bootstrap.name %>.css',
                    'dist/css/<%= fontawesome.name %>.css'
                ],
                dest: 'dist/css/jvisualcontent.css'
            }
        },
        watch: {
            all: {
                files: ['sources/less/*.less','sources/less/**/*.less','sources/js/**/*.js','sources/js/*.js'],
                tasks: ['css','js'],
                options: {
                    spawn: false
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks("grunt-css-url-rewrite");
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Default task(s).
    grunt.registerTask('default', ['uglify:libraries','uglify:some_files','less','usebanner:dist','cssmin','cssmin:test','cssUrlRewrite']);
    grunt.registerTask('js', ['concat:bootstrap','uglify:bootstrap','uglify:bootstrap_front_end','uglify:some_files','uglify:libraries']);
    grunt.registerTask('bootstrap', ['concat:bootstrap','less:bootstrap','cssmin:bootstrap'
        ,'uglify:bootstrap','usebanner:bootstrap'
    ]);
    grunt.registerTask('fontawesome', ['less:fontawesome','cssmin:fontawesome','usebanner:fontawesome']);
    grunt.registerTask('libraries', ['less:libraries','cssmin:libraries']);
    grunt.registerTask('front-end', ['bootstrap','fontawesome'
        ,'concat:front_end','cssmin:front_end','usebanner:front_end']);
    grunt.registerTask('css', ['less:admin','cssmin','usebanner:dist','front-end']);

};