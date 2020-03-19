const gulp = require("gulp");
const ts = require('gulp-typescript');
const plumber = require("gulp-plumber");
const sourcemaps = require("gulp-sourcemaps");
const less = require("gulp-less");
const minifyCss = require("gulp-minify-css");
const gulpSass = require("gulp-sass");
const gulpif = require("gulp-if");
const htmlmin = require("gulp-htmlmin");
const path = require("path");
const {
    execSync
} = require("child_process");
const fsex = require("fs-extra");
const replace = require('gulp-replace');

//1. 编译ts文件
//2. 编译html文件
//3. 编译less文件
//4. 编译js文件
//5. 编译sass文件
let result = "dist/";
const source = "src/"
var idx = process.argv.indexOf("xpnowatch");
if (idx == -1) {
    result = "dist/";
} else {
    result = "xpdist/";
}
gulp.task("compileTsFile", () => {
    gulp.src([`${source}**/*.ts`])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(ts({
            "module": "commonjs",
            "target": "ES6",
            "moduleResolution": "node",
            "removeComments": true,
            "alwaysStrict": true,
            "skipLibCheck": true
        }))
        .pipe(sourcemaps.write('./', {
            includeContent: false,
            sourceRoot: path.resolve(__dirname, source)
        }))
        .pipe(gulp.dest(`${result}`))
})

gulp.task("copyAppJson", () => {
    gulp.src([`${source}/app.json`])
        .pipe(gulp.dest(`${result}`))
})

gulp.task("watch", () => {
    gulp.watch([`${source}/app.json`], ["copyAppJson"])
    gulp.watch([`${source}**/*.ts`], ["compileTsFile"])
})


// 处理生成的 HTML 在JS文件前加 ./ 
gulp.task("handleHtmlIndex", () => {
    let dir = 'xpdist/fe/'
    gulp.src([`${dir}/index.html`])
        .pipe(replace('/verdor.bundle', './verdor.bundle'))
        .pipe(replace('/app.bundle', './app.bundle'))
        .pipe(gulp.dest(`${dir}`))
})
gulp.task("deletefe", () => {
    let dir = 'xpdist/fe/'
    execSync('git pull')
    fsex.removeSync(path.join(__dirname, dir))
})

//执行命令:gulp，或 npm run build ，生成dist文件夹，适用于win7
//执行命令:gulp xp，生成dist文件夹，适用于xp
//执行命令:npm run buildxp，生成xpdist文件夹，适用于xp
gulp.task("default", ["copyAppJson", "compileTsFile", "watch"])
gulp.task("nowatch", ["copyAppJson", "compileTsFile"])
gulp.task("xpnowatch", ["copyAppJson", "compileTsFile"])