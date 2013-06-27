var mongoose  = require('mongoose')
  , express   = require('express')
  , app       = express()
  , server    = require('http').createServer(app)
  , debug     = require('debug')('lelylan');

var ascoltatori = require('ascoltatori')
  , ascoltatore;

var settings = {
    uri: process.env.MONGOLAB_JOBS_HOST,
    db: process.env.MONGOLAB_JOBS_DB,
    pubsubCollection: 'mqtt',
    mongo: {}
  };


// -------------
// Ascoltatori
// -------------

ascoltatori.build(settings, function (_ascoltatore) {
  ascoltatore = _ascoltatore;

  ascoltatore.subscribe('mqtt/*', function() {
    debug('-- Receving published message');
    debug('TOPIC', arguments['0']);
    debug('PAYLOAD', arguments['1']);
  });
});


// ---------------
// Express Server
// ---------------

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/app/assets'))
});

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html')
});

app.put('/devices/:id', function(req, res) {
  var secret = req.get('X-Physical-Secret');

  debug('-- Request received');
  debug('DEVICE ID', req.params.id);
  debug('DEVICE SECRET', secret);
  debug('DEVICE PROPERTIES', req.body);

  ascoltatore.publish('mqtt/' + secret + '/set', req.body.properties);
  res.status(202).json({});
});

server.listen(process.env.PORT);
debug('Server listening on port', process.env.PORT);
