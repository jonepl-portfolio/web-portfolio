var gulp = require("gulp");
var header = require("gulp-header");
var cleanCSS = require("gulp-clean-css");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var pkg = require("./package.json");
var browserSync = require("browser-sync").create();
const sass = require('gulp-sass')(require('sass'));

async function createVendor() {
    // Bootstrap
    gulp.src([
        "./node_modules/bootstrap/dist/**/*",
        "!./node_modules/bootstrap/dist/css/bootstrap-grid*",
        "!./node_modules/bootstrap/dist/css/bootstrap-reboot*"
    ])
    .pipe(gulp.dest("./dist/vendor/bootstrap"));

    // Font Awesome
    gulp.src([
        "./node_modules/font-awesome/**/*",
        "!./node_modules/font-awesome/{less,less/*}",
        "!./node_modules/font-awesome/{scss,scss/*}",
        "!./node_modules/font-awesome/.*",
        "!./node_modules/font-awesome/*.{txt,json,md}"
    ])
    .pipe(gulp.dest("./dist/vendor/font-awesome"));

    // // jQuery
    gulp.src([
        "./node_modules/jquery/dist/*",
        "!./node_modules/jquery/dist/core.js"
    ])
    .pipe(gulp.dest("./dist/vendor/jquery"));

    // // jQuery Easing
    gulp.src(["./node_modules/jquery.easing/*.js"])
    .pipe(gulp.dest("./dist/vendor/jquery-easing"));

    // // Magnific Popup
    gulp
    .src(["./node_modules/magnific-popup/dist/*"])
    .pipe(gulp.dest("./dist/vendor/magnific-popup"));

    // // Scrollreveal
    gulp
    .src(["./node_modules/scrollreveal/dist/*.js"])
    .pipe(gulp.dest("./dist/vendor/scrollreveal"));
}

async function moveHtml() {
    gulp.src("./src/*.html")
    .pipe(gulp.dest('./dist/'));
}

async function minifyCss() {
    return gulp
        .src(["./src/css/*.css", "!./css/*.min.css"])
        .pipe(cleanCSS())
        .pipe(
        rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest("./dist/css"))
        .pipe(browserSync.stream());
}

async function compileCss() {
    gulp.src("./src/scss/**/*.scss")
        .pipe(
        sass
            .sync({
            outputStyle: "expanded"
            })
            .on("error", sass.logError)
        )
        .pipe(gulp.dest("./dist/css"));
}

async function minifyJavaScript() {
    gulp
    .src(["./src/js/*.js", "!./js/*.min.js"])
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest("./dist/js"))
    .pipe(browserSync.stream());
}

async function syncBrowserDist() {
    browserSync.init({
        server: {
          baseDir: "./dist/"
        }
      });
}

async function syncBrowserSrc() {
    browserSync.init({
        server: {
          baseDir: "./src/"
        }
      });
}

async function moveDocs() {
    gulp.src('./src/docs/**/*')
        .pipe(gulp.dest('./dist/docs'));
}

// Copy third party libraries from /node_modules into /vendor
gulp.task("vendor", createVendor);

gulp.task("js:minify", minifyJavaScript)

gulp.task("js", gulp.series(minifyJavaScript))

gulp.task("css:compile", compileCss)

gulp.task("css:minify", minifyCss);

gulp.task('html', moveHtml)

gulp.task("css", gulp.series("css:compile", "css:minify"))

gulp.task('build', gulp.series('css', 'js', 'vendor', 'html'));

gulp.task('default', gulp.series('build'))

gulp.task('bowerSync', syncBrowserSrc);

gulp.task('dev', gulp.series('build', syncBrowserSrc), async function () {
    gulp.watch("./scss/*.scss", compileCss);
    gulp.watch("./js/*.js", minifyJavaScript);
    gulp.watch("./*.html").on('change', browserSync.reload);
});

gulp.task('dist', gulp.series('build', syncBrowserDist), async function () {
    gulp.watch("./scss/*.scss", compileCss);
    gulp.watch("./js/*.js", minifyJavaScript);
    gulp.watch("./*.html").on('change', browserSync.reload);
});