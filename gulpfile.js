const gulp = require ('gulp');
const webserver = require ('gulp-webserver');
const imagenes = require ('gulp-imagemin');
const sass = require ('gulp-sass');
const autoprefixer = require ('gulp-autoprefixer');
const watch = require ('gulp-watch');
const concat = require ('gulp-concat');
const uglify = require ('gulp-uglify');
const pug = require ('gulp-pug');



const rutas = {
	scss: {
		main: './app/scss/main.scss',
		watch: './app/scss/**/*.*',
		output: './dist/css/'
	},

	pug:{
		main: './app/views/*.pug',
      	watch: './app/views/**/*.pug',
      	output: './dist/'
	},

	js:{
		main: './app/js/main.js',
     	watch: './app/js/**/*.js',
    	output: './dist/js/'
	}

}



gulp.task('pug', function(){
	gulp.src(rutas.pug.watch)
	.pipe(pug({
		pretty: true
	}))
	.pipe(gulp.dest(rutas.pug.output))
});



gulp.task('js', function(){
	gulp.src(rutas.js.watch)
	.pipe(gulp.dest(rutas.js.output))
});



gulp.task('concatenar', ['js'], function(){
	gulp.src(rutas.js.watch)
	.pipe(concat('main.js'))
	//.pipe(uglify()) // minificado de js
	.pipe(gulp.dest(rutas.js.output))
});



gulp.task('imagenes', function(){
   gulp.src('./app/img/**/*.{png,jpg,gif,jpeg,svg}')
   .pipe(imagenes({
        interlaced: true,
        progressive: true,
        optimizationLevel: 2,
        svgoPlugins: [{removeViewBox: true}]
   }))
   .pipe(gulp.dest('./dist/img/'))
});



gulp.task('server', function(){
	gulp.src('./dist/')
	.pipe(webserver({
		host:'0.0.0.0',
		port:9000,
		livereload:true
	}));
});


gulp.task('sass', function(){
	gulp.src(rutas.scss.main)
	.pipe(sass({
		outputStyle: 'nested',
		// outputStyle: 'compressed',
    	sourceComments: true
	}))
	.pipe(autoprefixer({
		versions:['last 2 browsers']
	}))
	.pipe(gulp.dest(rutas.scss.output))
});


gulp.task('fonts', function(){
   gulp.src('./app/fonts' + '/**' + '/*.*')
   .pipe(gulp.dest('./dist/fonts/'));

});


gulp.task('librerias-build', function(){
	gulp.src('./app/lib' + '/**' + '/*.*')
	.pipe(gulp.dest('./dist/lib'))
});


gulp.task('watch', function(){
	gulp.watch(rutas.scss.watch, ['sass']);
  	gulp.watch(rutas.pug.watch, ['pug']);
  	gulp.watch(rutas.js.watch, ['concatenar']);
});


gulp.task('vidaTres', [

	'server',
	'sass',
	'pug',
	'concatenar',
	'fonts',
	'librerias-build',
	'imagenes',
	'watch'

]);
