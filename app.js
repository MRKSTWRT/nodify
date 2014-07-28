var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var https = require('https');
var session = require('express-session');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var config = require('./config');

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: config.db.host,
    user: config.db.user,
    password: config.db.pass,
    database: config.db.name
  }
});

//Define routes
var routes = {
  index: require('./routes/index'),
  check: require('./routes/check'),
  esciframe: require('./routes/escapeiframe'),
  authapp: require('./routes/authapp'),
  finishauth: require('./routes/finishauth'),
  uninstall: require('./routes/uninstall'),
  checksig: require('./routes/checksig')
};

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('env', 'development');
app.locals.pretty = true;

//Add raw body to the request, needed for verifying webhooks etc.
app.use(function(req, res, next) {
    req.rawBody = '';
    req.on('data', function(chunk) {
      req.rawBody += chunk;
    });
    next();
});

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({secret: config.app.sessionSecret, saveUninitialized: true, resave: true}));
app.use(express.static(path.join(__dirname, 'public')));

// Make db accessible to router
app.use(function(req, res, next) {
  req.knex = knex;
  next();
});

//Routes to use
app.use('*', routes.checksig);
app.use('/check', routes.check);
app.use('/esc', routes.esciframe);
app.use('/authapp', routes.authapp);
app.use('/finishauth', routes.finishauth);
app.use('/uninstall', routes.uninstall);
app.use('/render', routes.index);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
