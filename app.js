var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');
var flash = require('express-flash');
var session = require('express-session');
var bodyParser = require('body-parser');
var fs=require('fs');
var mysql = require('mysql');
var connection  = require('./lib/db');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var canhosRouter = require('./routes/canhos');
var hopdongsRouter =require('./routes/hopdongs');
var thanhlysRouter=require('./routes/thanhlys');
var uploadRouter=require('./routes/upload');
var multer=require('multer');
var app = express();
var helpers = require('./helpers/helpers');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get("/", express.static(path.join(__dirname, "./public")));

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'uploads/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});


const http = require('http');


// Start the server on port 1308
app.listen(1308, '127.0.0.1');
console.log('Node server running on port 1308');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(flash());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ 
  secret: '123456cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/canhos',canhosRouter);
app.use('/hopdongs',hopdongsRouter);
app.use('/thanhlys',thanhlysRouter);
app.use('/upload',uploadRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

  
});




module.exports = app;
