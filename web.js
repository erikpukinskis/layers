var express = require('express')
  , mongoose = require('mongoose')
  , app = express()
  , _ = require('underscore');

_.str = require('underscore.string');
_.mixin(_.str.exports());

app.use(express.static('public'));
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.bodyParser());
app.locals.pretty = true;

var MongoRest = require('mongo-rest')
  , mongoRest = new MongoRest(app, {enableXhr: true});

mongoose.connect('localhost', 'layers-development');

app.get('/', function (req, res) {
  res.redirect('game.html');
});

var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log("Listening on " + port);
});