'use strict';

module.exports = function ( grunt ) {

  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Load in our build configuration file.
  var userConfig = require( './config/build.config.js' );

  /**
   * This is the configuration object Grunt uses to give each plugin its 
   * instructions.
   */
  var taskConfig = {
    /**
     * We read in our `package.json` file so we can access the package name and
     * version. It's already there, so we don't repeat ourselves here.
     */
    pkg: grunt.file.readJSON('package.json'),

    /**
     * Creates a changelog on a new version.
     */
    changelog: {
      options: {
        dest: 'CHANGELOG.md',
        template: 'changelog.tpl'
      }
    },

    /**
     * Increments the version number, etc.
     */
    bump: {
      options: {
        files: [
          'package.json',
          'bower.json'
        ],
        commit: false,
        commitMessage: 'chore(release): v%VERSION%',
        commitFiles: [
          'package.json',
          'client/bower.json'
        ],
        createTag: false,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'origin'
      }
    },

    // The directories to delete when `grunt clean` is executed.
    clean: [
      '<%= buildDir %>',
      '<%= compileDir %>'
    ],

    /**
     * The `copy` task just copies files from A to B. We use it here to copy
     * our project assets (images, fonts, etc.) and javascripts into
     * `build_dir`, and then to copy the assets to `compile_dir`.
     */
    copy: {
      buildAssets: {
        files: [
          {
            src: [ '**','!**/*.md' ],
            dest: '<%= buildDir %>/assets/',
            cwd: 'src/assets',
            expand: true
          }
        ]
      },
      buildAppjs: {
        files: [
          {
            src: [ '<%= appFiles.js %>' ],
            dest: '<%= buildDir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      buildVendorjs: {
        files: [
          {
            src: [ '<%= vendorFiles.js %>' ],
            dest: '<%= buildDir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      compileAssets: {
        files: [
          {
            src: [ '**' ],
            dest: '<%= compileDir %>/assets',
            cwd: '<%= buildDir %>/assets',
            expand: true
          }
        ]
      }
    },

    // `grunt concat` concatenates multiple source files into a single file.
    concat: {
      /**
       * The `compile_js` target is the concatenation of our application source
       * code and all specified vendor source code into a single file.
       */
      compilejs: {
        src: [
          '<%= vendorFiles.js %>',
          'module.prefix',
          '<%= buildDir %>/src/**/*.js',
          '<%= html2js.app.dest %>',
          '<%= html2js.common.dest %>',
          '<%= vendorFiles.js %>',
          'module.suffix'
        ],
        dest: '<%= compileDir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },
    ngmin: {
      compile: {
        files: [
          {
            src: [ '<%= appFiles.js %>' ],
            cwd: '<%= buildDir %>',
            dest: '<%= buildDir %>',
            expand: true
          }
        ]
      }
    },
    // Minify the sources!
    uglify: {
      compile: {
        files: {
          '<%= concat.compilejs.dest %>': '<%= concat.compilejs.dest %>'
        }
      }
    },

    /**
     * `recess` handles our LESS compilation and uglification automatically.
     * Only our `main.less` file is included in compilation; all other files
     * must be imported from this file.
     */
    recess: {
      build: {
        src: [ '<%= appFiles.less %>' ],
        dest: '<%= buildDir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css',
        options: {
          compile: true,
          compress: false,
          noUnderscores: false,
          noIDs: false,
          zeroUnits: false
        }
      },
      compile: {
        src: [ '<%= recess.build.dest %>' ],
        dest: '<%= recess.build.dest %>',
        options: {
          compile: true,
          compress: true,
          noUnderscores: false,
          noIDs: false,
          zeroUnits: false
        }
      }
    },

    /**
     * `jshint` defines the rules of our linter as well as which files we
     * should check. This file, all javascript sources, and all our unit tests
     * are linted based on the policies listed in `options`. But we can also
     * specify exclusionary patterns by prefixing them with an exclamation
     * point (!); this is useful when code comes from a third party but is
     * nonetheless inside `src/`.
     */
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      src: [
        '<%= appFiles.js %>'
      ],
      test: [
        '<%= appFiles.jsunit %>'
      ],
      gruntfile: [
        'Gruntfile.js'
      ]
    },

    /**
     * HTML2JS is a Grunt plugin that takes all of your template files and
     * places them into JavaScript files as strings that are added to
     * AngularJS's template cache. This means that the templates too become
     * part of the initial payload as one JavaScript file. Neat!
     */
    html2js: {
      /**
       * These are the templates from `src/app`.
       */
      app: {
        options: {
          base: 'src/app'
        },
        src: [ '<%= appFiles.atpl %>' ],
        dest: '<%= buildDir %>/templates-app.js'
      },

      /**
       * These are the templates from `src/common`.
       */
      common: {
        options: {
          base: 'src/common'
        },
        src: [ '<%= appFiles.ctpl %>' ],
        dest: '<%= buildDir %>/templates-common.js'
      }
    },

    /**
     * The Karma configurations.
     */
    karma: {
      options: {
        configFile: '<%= buildDir %>/karma-unit.js'
      },
      unit: {
        runnerPort: 9101,
        background: true
      },
      continuous: {
        singleRun: true
      }
    },

    /**
     * The `index` task compiles the `index.html` file as a Grunt template. CSS
     * and JS files co-exist here but they get split apart later.
     */
    index: {

      /**
       * During development, we don't want to have wait for compilation,
       * concatenation, minification, etc. So to avoid these steps, we simply
       * add all script files directly to the `<head>` of `index.html`. The
       * `src` property contains the list of included files.
       */
      build: {
        dir: '<%= buildDir %>',
        src: [
          '<%= vendorFiles.js %>',
          '<%= buildDir %>/src/**/*.js',
          '<%= html2js.common.dest %>',
          '<%= html2js.app.dest %>',
          '<%= vendorFiles.css %>',
          '<%= recess.build.dest %>'
        ]
      },

      /**
       * When it is time to have a completely compiled application, we can
       * alter the above to include only a single JavaScript and a single CSS
       * file. Now we're back!
       */
      compile: {
        dir: '<%= compileDir %>',
        src: [
          '<%= concat.compilejs.dest %>',
          '<%= vendorFiles.css %>',
          '<%= recess.compile.dest %>'
        ]
      }
    },

    /**
     * This task compiles the karma template so that changes to its file array
     * don't have to be managed manually.
     */
    karmaconfig: {
      unit: {
        dir: '<%= buildDir %>',
        src: [
          '<%= vendorFiles.js %>',
          '<%= html2js.app.dest %>',
          '<%= html2js.common.dest %>',
          'vendor/angular-mocks/angular-mocks.js'
        ]
      }
    },

    /**
     * And for rapid development, we have a watch set up that checks to see if
     * any of the files listed below change, and then to execute the listed 
     * tasks when they do. This just saves us from having to type "grunt" into
     * the command-line every time we want to see what we're working on; we can
     * instead just leave "grunt watch" running in a background terminal. Set it
     * and forget it, as Ron Popeil used to tell us.
     *
     * But we don't need the same thing to happen for all the files. 
     */
    delta: {
      /**
       * By default, we want the Live Reload to work for all tasks; this is
       * overridden in some tasks (like this file) where browser resources are
       * unaffected. It runs by default on port 35729, which your browser
       * plugin should auto-detect.
       */
      options: {
        livereload: true
      },

      /**
       * When the Gruntfile changes, we just want to lint it. In fact, when
       * your Gruntfile changes, it will automatically be reloaded!
       */
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: [ 'jshint:gruntfile' ],
        options: {
          livereload: false
        }
      },

      /**
       * When our JavaScript source files change, we want to run lint them and
       * run our unit tests.
       */
      jssrc: {
        files: [
          '<%= appFiles.js %>', 'server.js'
        ],
        tasks: [ 'jshint:src', 'karma:unit:run', 'copy:buildAppjs' ]
      },

      /**
       * When assets are changed, copy them. Note that this will *not* copy new
       * files, so this is probably not very useful.
       */
      assets: {
        files: [
          'src/assets/**/*'
        ],
        tasks: [ 'copy:buildAssets' ]
      },

      /**
       * When index.html changes, we need to compile it.
       */
      html: {
        files: [ '<%= appFiles.html %>' ],
        tasks: [ 'index:build' ]
      },

      /**
       * When our templates change, we only rewrite the template cache.
       */
      tpls: {
        files: [
          '<%= appFiles.atpl %>',
          '<%= appFiles.ctpl %>'
        ],
        tasks: [ 'html2js' ]
      },

      /**
       * When the CSS files change, we need to compile and minify them.
       */
      less: {
        files: [ 'src/**/*.less' ],
        tasks: [ 'recess:build' ]
      },

      /**
       * When a JavaScript unit test file changes, we only want to lint it and
       * run the unit tests. We don't want to do any live reloading.
       */
      jsunit: {
        files: [
          '<%= appFiles.jsunit %>'
        ],
        tasks: [ 'jshint:test', 'karma:unit:run' ],
        options: {
          livereload: false
        }
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= buildDir %>/**/{,*/}*.js',
            '<%= buildDir %>/assets/{,*/}*.{png,jpg,jpeg,gif,webp,svg,css}'
          ]
        }
      }
    }
  };

  grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );

  /**
   * In order to make it safe to just compile or copy *only* what was changed,
   * we need to ensure we are starting from a clean, fresh build. So we rename
   * the `watch` task to `delta` (that's why the configuration var above is
   * `delta`) and then add a new task called `watch` that does a clean build
   * before watching for changes.
   */
  grunt.renameTask( 'watch', 'delta' );
  grunt.registerTask( 'watch', [ 'build', 'karma:unit', 'delta' ] );

  /**
   * The default task is to bump the version, build and compile.
   */
  grunt.registerTask( 'default', [ 'bump', 'build', 'compile' ] );

  /**
   * The `build` task gets your app ready to run for development and testing.
   */
  grunt.registerTask( 'build', [
    'clean',
    'html2js',
    'jshint',
    'recess:build',
    'copy:buildAssets',
    'copy:buildAppjs',
    'copy:buildVendorjs',
    'index:build' //, 'karmaconfig' , 'karma:continuous'
  ]);

  /**
   * The `compile` task gets your app ready for deployment by concatenating and
   * minifying your code.
   */
  grunt.registerTask( 'compile', ['recess:compile', 'copy:compileAssets', 'ngmin', 'concat',
    'uglify', 'index:compile'
  ]);

  /**
   * A utility function to get all app JavaScript sources.
   */
  function filterForJS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.js$/ );
    });
  }

  /**
   * A utility function to get all app CSS sources.
   */
  function filterForCSS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.css$/ );
    });
  }

  /** 
   * The index.html template includes the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task assembles
   * the list into variables for the template to use and then runs the
   * compilation.
   */
  grunt.registerMultiTask( 'index', 'Process index.html template', function () {
    var dirRE = new RegExp( '^('+grunt.config('buildDir')+'|'+grunt.config('compileDir')+')\/', 'g' );
    var jsFiles = filterForJS( this.filesSrc ).map( function ( file ) {
      return file.replace( dirRE, '' );
    });
    var cssFiles = filterForCSS( this.filesSrc ).map( function ( file ) {
      return file.replace( dirRE, '' );
    });

    grunt.file.copy('src/index.html', this.data.dir + '/index.html', {
      process: function ( contents ) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles,
            styles: cssFiles,
            version: grunt.config( 'pkg.version' )
          }
        });
      }
    });
  });

  /**
   * In order to avoid having to specify manually the files needed for karma to
   * run, we use grunt to manage the list for us. The `karma/*` files are
   * compiled as grunt templates for use by Karma. Yay!
   */
  grunt.registerMultiTask( 'karmaconfig', 'Process karma config templates', function () {
    var jsFiles = filterForJS( this.filesSrc );

    grunt.file.copy( 'karma/karma-unit.tpl.js', grunt.config( 'buildDir' ) + '/karma-unit.js', {
      process: function ( contents ) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles
          }
        });
      }
    });
  });
};