var gulp = require('gulp');
var server = require('gulp-server-livereload');

gulp.task('webserver', function () {
    gulp.src('./')
        .pipe(server({
            livereload: {
                enable: true,
                filter: function (filePath, cb) {
                    cb(!(/node_modules/.test(filePath)));
                },
            },
            defaultFile: 'index.html',
            fallback: 'index.html',
            open: true
        }));
});