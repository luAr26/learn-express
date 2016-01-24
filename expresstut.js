(function () {
  'use strict';
  var express, app, handlebars;

  express = require('express');
  app = express();

  app.disable('x-powered-by');
  handlebars = require('express-handlebars');

  app.engine('handlebars', handlebars({defaultLayout: 'main'}));
  app.set('view engine', 'handlebars');


  app.set('port', process.env.PORT || 3000);
  app.use(express.static(__dirname + '/public'));

  app.get('/', function (req, res) {
    res.render('home');
  });

  app.get('/about', function (req, res) {
    res.render('about');
  });


  app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '. Press Ctrl+C to terminate...');
  });
}());
