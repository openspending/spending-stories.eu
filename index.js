'use strict';

var path = require('path');
var express = require('express');
var auth = require('http-auth');

var config = {
  port: process.env.PORT || 3300,
  accessToken: process.env.SUBSIDYSTORIESEU_ASSESS_TOKEN || ''
};

var app = express();

app.set('config', config);
app.set('port', config.port);

var middlewares = [];

// simple auth
if (config.accessToken != '') {
  middlewares.push(auth.connect(auth.basic(
    {realm: 'Protected area.'},
    function(username, password, callback) {
      var token = config.accessToken;
      var allow = ((username == token) && (password == '')) ||
        ((username == '') && (password == token)) ||
        ((username == token) && (password == token));
      callback(allow);
    }
  )));
}

// assets
app.use('/public', express.static(path.join(__dirname, 'public')));

// pages
app.use(middlewares, express.static(path.join(__dirname, 'app/pages')));

app.listen(app.get('port'), function() {
  console.log('Listening on :' + app.get('port'));
});
