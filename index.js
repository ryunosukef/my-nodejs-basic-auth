var express = require('express');
var app = express();
var basicAuth = require('basic-auth-connect');

var username = process.env.BASIC_AUTH_USERNAME;
var password = process.env.BASIC_AUTH_PASSWORD;

if (username && password) {
      app.use(basicAuth(username, password));
}

app.use(express.static(__dirname + '/public'));

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
      console.log("Node app is running at localhost:" + app.get('port'))
})
