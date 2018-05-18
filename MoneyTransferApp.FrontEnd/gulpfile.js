/// <binding />
var gulp = require("gulp");
var clean = require('gulp-clean');
var exec = require("child_process").exec;

gulp.task("copy-assets",
    function () {
        gulp.src(["../MoneyTransferApp.Web/wwwroot/*.bundle.*", "../MoneyTransferApp.Web/wwwroot/*.chunk.*"])
            .pipe(clean({ force: true }));
        gulp.src(["../MoneyTransferApp.FrontEnd/dist/**"])
            .pipe(gulp.dest("../MoneyTransferApp.Web/wwwroot"));
    });

gulp.task("build-fe-debug",
    function (cb) {
        exec("cd ../MoneyTransferApp.FrontEnd && npm run build", function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            cb(err);
            gulp.start("copy-assets");
        });
    });

gulp.task("build-fe-production",
    function (cb) {
        exec("cd ../MoneyTransferApp.FrontEnd && npm run build-prod", function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            cb(err);
            gulp.start("copy-assets");
        });
    });
