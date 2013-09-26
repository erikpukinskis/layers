var express = require('express')
  , mongoose = require('mongoose')
  , app = express()
  , _ = require('underscore');

_.str = require('underscore.string');
_.mixin(_.str.exports());
_process = process;
app.use(express.static('public'));
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.bodyParser());
app.locals.pretty = true;

var MongoRest = require('mongo-rest')
  , mongoRest = new MongoRest(app, {enableXhr: true});

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/layers');

var rand = function(max) {
  return parseInt(Math.random()*max);
}

var Thing = mongoose.model('Thing', { 
  slug: String, 
  objects: [{
    x: Number, 
    y: Number, 
    colorSeed: [Number],
  }],
});

Thing.prototype.url = function() {
  var host = process.env.PORT ? 'http://many-layers.herokuapp.com' : ('http://localhost:' + port);
  return host + '/a/' + this.slug;
}

app.get('/', function (req, res) {
  res.sendfile('public/game.html');
});

app.get('/a/:slug', function(req,res) {
  if (req.accepts(['html', 'json']) == 'json') {
    console.log(req.params.slug);
    Thing.findOne({'slug': req.params.slug}, 'objects', function(err, thing) {
      if(thing) {
        console.log('yup');
        res.json(thing);
      } else {
        console.log('nope');
        res.json({thing: null});
      }
    });
  } else {
    res.sendfile('public/game.html');
  }
});

app.post('/things', function (req, res) {
  slug = req.body.label.replace(/[^a-zA-Z0-9]*/, '-');
  slug = slug.replace(/-*/, '-').toLowerCase();
  slug = slug.replace(/(^-|-$)/, '');

  var thing = new Thing({objects: req.body.objects});

  save(thing, slug, false, function(thing) {
    res.json({ url: thing.url() });
  });
});

function save(thing, slug, suffix, callback, count) {
  count = count || 0;
  var fullSlug = slug + (suffix ? aSuffix() : '');
  if (count > 10) {
    fullSlug = fullSlug + '-' + (count-9)
  }
  Thing.findOne({slug: fullSlug}, function(err, found) {
    if (found) {
      save(thing, slug, true, callback, count+1);
    } else {
      thing.slug = fullSlug
      thing.save(function(err) {
        console.log(thing);
        console.log('error is ' + err);
        callback(thing);
      });
    }
  });
}


PREPOSITIONS = ['of','by','through','within','betwixt','around','without','under','beyond'];
ADJECTIVES = ['jaunty','free','obvi','crabby','empty','old','new','felted','poor','nice'];
THINGS = ['jet','lev','sense','fall','up','rent','sky','trouble','bins','chaos'];


function aSuffix() {
  return '-' + PREPOSITIONS[rand(PREPOSITIONS.length)] + 
    '-' + ADJECTIVES[rand(ADJECTIVES.length)] + 
    '-' + THINGS[rand(THINGS.length)];
} 



var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log("Listening on " + port);
});