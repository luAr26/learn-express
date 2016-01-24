(function () {
  'use strict';
  var express, app;

  express = require('express');
  app = express();

  app.set('port', process.env.PORT || 3000);

  app.get('/', function (req, res) {
    res.send('Hello, from express!');
  });

  app.listen(app.get('port'), function () {
    console.log('Express started on port ' + app.get('port') + '. Press Ctrl+C to terminate...');
  });
}());
