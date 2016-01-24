(function () {
  'use strict';
  var express,
      app,
      handlebars,
      bodyParser,
      formidable,
      credentials,
      cookieParser,
      session,
      parseurl,
      fs;

  bodyParser = require('body-parser');
  formidable = require('formidable');
  express = require('express');
  credentials = require('./credentials.js');
  cookieParser = require('cookie-parser');
  session = require('express-session');
  parseurl = require('parseurl');
  fs = require('fs');
  app = express();

  app.disable('x-powered-by');
  handlebars = require('express-handlebars');

  app.engine('handlebars', handlebars({defaultLayout: 'main'}));
  app.set('view engine', 'handlebars');

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser(credentials.cookieSecret));

  app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: credentials.cookieSecret
  }));

  app.use(function (req, res, next) {
    var views,
        pathname;
    views = req.session.views;

    if (!views) {
      views = req.session.views = {};
    }
    pathname = parseurl(req).pathname;
    views[pathname] = (views[pathname] || 0) + 1;
    next();
  });

  app.get('/viewcount', function (req, res, next) {
    var count, numberOfTimes;
    count = req.session.views['/viewcount'];
    numberOfTimes = (count === 1) ? 'time' : 'times';
    res.send('You viewed this page ' + count + ' ' + numberOfTimes);
  });


  app.set('port', process.env.PORT || 3000);
  app.use(express.static(__dirname + '/public'));

  app.get('/', function (req, res) {
    res.render('home');
  });

  app.use(function(req, res, next) {
    console.log('Looking for URL: ' + req.url);
    next();
  });

  app.get('/junk', function(req, res, next) {
    console.log('Tried to access the /junk');
    throw new Error('/junk doesn\'t exist');
  });

  app.use(function(err, req, res, next) {
    console.log('Error: ' + err.message);
    next();
  });

  app.get('/about', function (req, res) {
    res.render('about');
  });

  app.get('/contact', function (req, res) {
    res.render('contact', {
      csrf: 'CSRF token here'
    });
  });

  app.get('/thankyou', function (req, res) {
    res.render('thankyou');
  });

  app.post('/process', function (req, res) {
    console.log('Form: ' + req.query.form);
    console.log('CSRF token: ' + req.body._csrf);
    console.log('Email: ' + req.body.email);
    console.log('Email: ' + req.body.ques);
    res.redirect(303, '/thankyou');
  });

  app.get('/file-upload', function (req, res) {
    var now = new Date();
    res.render('file-upload', {
      year: now.getFullYear(),
      month: now.getMonth() + 1
    });
  });

  app.post('/file-upload/:year/:month', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, file) {
      if (err) {
        return res.redirect(303, '/error');
      }
      console.log('Received File');
      console.log(file);
      res.redirect(303, '/thankyou');
    });
  });

  app.get('/cookie', function (req, res) {
    res.cookie('username', 'Raul26', {
      expire: new Date() + 9999
    }).send('username has the value of Raul26');
  });

  app.get('/listcookies', function (req, res) {
    console.log('Cookies: ' + req.cookies);
    res.send('Looking in the console for cookies.');
  });

  app.get('/deletecookie', function (req, res) {
    res.clearCookie('username');
    res.send('username cookie deleted.');
  });

  app.get('/readfile', function (req, res, next) {
    fs.readFile('./public/rf.txt', function (err, data) {
      if (err) {
        return console.error(err);
      }
      res.send('The file: ' + data.toString());
    });
  });

  app.get('/writefile', function (req, res, next) {
    fs.writeFile('./public/rf2.txt', 'More random text.', function (err) {
      if (err) {
        return console.error(err);
      }
    });

    fs.readFile('./public/rf2.txt', function (err, data) {
      if (err) {
        return console.error(err);
      }
      res.send('The file: ' + data.toString());
    });
  });

  app.use(function (req, res) {
    res.type('text/html');
    res.status(404);
    res.render('404');
  });

  app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(500);
    res.render('500');
  });

  app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '. Press Ctrl+C to terminate...');
  });
}());
