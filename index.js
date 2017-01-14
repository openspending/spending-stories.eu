'use strict';

var path = require('path');
var express = require('express');
var auth = require('http-auth');
var nunjucks = require('nunjucks');
var marked = require('marked');

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

var env = nunjucks.configure(path.join(__dirname, '/app/views'), {
  autoescape: true,
  express: app
});
env.addGlobal('marked', marked);
env.addFilter('marked', marked);

// pages
app.get(
  /\/(|index\.html|country\.html|country-details\.html)$/,
  middlewares,
  function(req, res) {
    var template = (req.params[0] != '' ? req.params[0] : 'index.html');
    res.render(template);
  }
);

app.listen(app.get('port'), function() {
  console.log('Listening on :' + app.get('port'));
});
