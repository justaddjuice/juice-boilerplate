'use strict';

/* =============================================================================================
   GULP -> CONSTANTS
   ============================================================================================= */

/**
 * Required dependency modules
 * @const {module}
 */
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const browsersync = require('browser-sync');
const concat = require('gulp-concat');
const connect = require('gulp-connect-php7');
const gulp = require('gulp');
const rename = require("gulp-rename");
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');

/**
 * Localhost proxy server and port for php connect
 * @const {string}
 */
const hostname = 'localhost/github/juice-starter';
const port = 3001;

/**
 * Resource development files
 * @const {array}
 */
const resource = {
    sass: 'dev/sass/app.scss',
    scripts: [
        'node_modules/just-add-juice/scripts/**/*.js',
        'dev/scripts/app.js'
    ]
};

/**
 * Output file names
 * @const {array}
 */
const filename = {
    css: 'app.min.css',
    scripts: 'app.min.js'
};

/**
 * Output build directories
 * @const {array}
 */
const build = {
    css: 'dist/css',
    scripts: 'dist/scripts'
};

/**
 * Watch these file types for changes
 * @const {array}
 */
const watch = {
    html: '**/*.html',
    twig: '**/*.twig',
    php: '**/*.php'
};


/* =============================================================================================
   GULP -> TASKS
   ============================================================================================= */

/**
 * Compile SASS to CSS, autoprefix, minimize, rename and reload browsersync
 * @module gulp-sass
 * @module gulp-autoprefixer
 * @module browser-sync
 */
gulp.task('build:css', () => {
    gulp.src(resource.sass)
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: [
                'node_modules/'
            ]
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(rename(filename.css))
        .pipe(gulp.dest(build.css))
        .pipe(browsersync.reload({
            stream: true
        }));
});

/**
 * Concat all JavaScript files, strip comments, compile ES6 to ES5, minimize and reload browsersync
 * @module gulp-concat
 * @module gulp-babel
 * @module gulp-uglify
 * @module browser-sync
 */
gulp.task('build:scripts', () => {
    gulp.src(resource.scripts)
		.pipe(concat(filename.scripts))
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(build.scripts))
        .pipe(browsersync.reload({
            stream: true
        }));
});

/**
 * Run all individual build tasks
 */
gulp.task('build', () => {
    // Start the gulp css and scripts tasks
    gulp.start('build:css');
    gulp.start('build:scripts');
});

/**
 * Start a development server, watch for file changes, run specific tasks and reload browsersync
 * @module gulp-connect-php7
 * @module browser-sync
 */
gulp.task('dev', () => {
    // Start a new server with browsersync
    connect.server({}, () => {
        // Proxy the localhost hostname
        browsersync({
            proxy: hostname,
            port: port
        });
    });

    // Watch for resource development file changes and call the respecitve build task
    gulp.watch(resource.sass, ['build:css']);
    gulp.watch(resource.scripts, ['build:scripts']);

    // Watch for declared file changes and reload browsersync
    gulp.watch([watch.html, watch.twig, watch.php]).on('change', () => {
        // Reload browsersync
        browsersync.reload({
            stream: true
        });
    });
});
