var gulp = require('gulp'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    url = require('url'),
    path = require('path'),
    babelify = require('babelify'),
    rimraf = require('rimraf'),
    source = require('vinyl-source-stream'),
    _ = require('lodash'),
    uglify = require('gulp-uglify'),
    minifyHtml = require('gulp-minify-html'),
    minifyCss = require('gulp-minify-css'),
    rev = require('gulp-rev'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    usemin = require('gulp-usemin'),
    copy = require('gulp-copy'),
    templateCache = require('gulp-angular-templatecache'),
    htmlify = require('gulp-angular-htmlify'),
    ngAnnotate = require('gulp-ng-annotate'),
    autoprefixer = require('gulp-autoprefixer'),
    gutil = require('gulp-util'),
    replace = require('gulp-replace'),
    requirejs = require('gulp-requirejs');

var sourcePrefix = './src/main/sourceapp/';

var config = {
    appDir: sourcePrefix + 'app/',
    outputDir: './src/main/webapp/',
    assetsDir: sourcePrefix + 'assets/',
    outputFile: 'app.js',
    bowerDir: './bower_components',
    views: sourcePrefix + 'views/**/*.html'
};

var bundler;
function getBundler() {
    if (!bundler) {
        bundler = watchify(browserify(config.appDir + 'init.js', _.extend({debug: true}, watchify.args)));
    }
    return bundler;
}
function bundle() {
    return getBundler()
        .transform(babelify)
        .bundle()
        .on('error', function (err) {
            console.log('Error: ' + err.message);
        })
        .pipe(source(config.outputFile))
        .pipe(ngAnnotate())
        .pipe(gulp.dest(config.outputDir));
}

gulp.task('build-persistent', [], function () {
    return bundle();
});

gulp.task('less', ['clean'], function () {
    return gulp.src(config.assetsDir + 'less/main.less')
        .pipe(less({
            paths: [path.join(__dirname, 'assets')]
        }))
        .pipe(gulp.dest(config.outputDir + 'assets/css'));
});
gulp.task('lessonly', function () {
    return gulp.src(config.assetsDir + 'less/main.less')
        .pipe(less({
            paths: [path.join(__dirname, 'assets')]
        }))
        .pipe(gulp.dest(config.outputDir + 'assets/css'));
});

gulp.task('clean', function (cb) {
    rimraf(config.outputDir, cb);
});

gulp.task('copyAssets', ['clean'], function () {
    gulp.src(config.bowerDir + '/font-awesome/fonts/*.{eot,ttf,woff,woff2,svg}')
        .pipe(copy(config.outputDir + 'assets', {
            prefix: 2
        }));

    return gulp.src(config.assetsDir + 'img/*.*').pipe(copy(config.outputDir, {
        prefix: 3
    }));
});

gulp.task('watch', ['less', 'copyAssets', 'build-persistent'], function () {
    gulp.watch(config.assetsDir + 'less/**/*.less', ['less']);

    getBundler().on('update', function () {
        gulp.start('build-persistent')
    });
});


gulp.task('usemin', ['build-persistent', 'requirejsBuild'], function () {
    return gulp.src(sourcePrefix + 'index.html')
        .pipe(usemin({
            html: [minifyHtml({empty: true})]
        }))
        .pipe(gulp.dest(config.outputDir));
});

gulp.task('copyLibs', ['clean'], function () {
    gulp.src(config.bowerDir + '/requirejs/require.js').pipe(copy(config.outputDir));
    return gulp.src(config.appDir + 'load-config.js').pipe(copy(config.outputDir, {
        prefix: 3
    }));
});

gulp.task('compileTemplates', ['build-persistent'], function () {
    return gulp.src(config.views)
        .pipe(htmlify())
        .pipe(templateCache({
            transformUrl: function (url) {
                return '/' + url;
            },
            root: 'views/',
            standalone: true,
            module: 'views'
        }))
        .pipe(gulp.dest(config.outputDir));
});

gulp.task('concat', ['build-persistent', 'compileTemplates'], function () {
    return gulp.src([config.outputDir + 'templates.js', config.outputDir + 'app.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest(config.outputDir));
});


gulp.task('requirejsBuild', ['concat', 'copyLibs'], function () {
    requirejs({
        baseUrl: config.appDir,
        optimize: 'none',
        name: 'main',
        preserveLicenseComments: false,
        useStrict: true,
        out: 'main.js',
        mainConfigFile: config.appDir + 'load-config.js'
    })
        .pipe(gulp.dest(config.outputDir + 'app')); // pipe it to the output DIR
});

gulp.task('replaceCssUrl', ['usemin', 'requirejsBuild'], function () {
    gulp.src('index.html')
        .pipe(replace('build/', ''))
        .pipe(gulp.dest(config.outputDir));
});

gulp.task('jsuglify', ['clean', 'requirejsBuild', 'usemin'], function () {
    return gulp.src(config.outputDir + 'app/main.js')
        .pipe(uglify({
            preserveComments: false
        }))
        .pipe(gulp.dest(config.outputDir + 'app'));
});

gulp.task('build', [
    'requirejsBuild',
    'replaceCssUrl',
    'jsuglify',
    'less',
    'copyAssets',
    'copyLibs'
], function () {
    process.exit(0);
});

gulp.task('build-lite', [
    'requirejsBuild',
    'replaceCssUrl',
    'less',
    'copyAssets',
    'copyLibs'
], function () {
    process.exit(0);
});
