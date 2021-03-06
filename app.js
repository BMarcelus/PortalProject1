var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('client-sessions');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost/" +(process.env.DATABASE || 'onlineorders'));


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  cookieName: 'session',
  secret: '3lKLRVHiF6zFBjvBk3J7KMgpF1gj7HEBHz30dTvg',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));


var index = require('./routes/index');
var menu = require('./routes/menu');
var cart = require('./routes/cart');
var user = require('./routes/users');
var orders = require('./routes/orders');
var coupons = require('./routes/coupon');

app.use('/', index);
app.use('/menu', menu);
app.use('/cart', cart);
app.use('/user', user)
app.use('/orders', orders)
app.use('/coupons', coupons);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
