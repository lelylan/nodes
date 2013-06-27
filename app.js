var mongoose  = require('mongoose')
  , express   = require('express')
  , app       = express()
  , server    = require('http').createServer(app)
  , debug     = require('debug')('lelylan');

var Device = require('./app/models/mqtt/device')
  , ascoltatori = require('ascoltatori')
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
    debug('-- Receving subscription payload');
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
  var topic = 'mqtt/' + req.get('X-Physical-Secret') + '/set';
  ascoltatore.publish(topic, req.body.properties);
  Device.findOrCreate(req, function(err, doc) { if (err) debug('Error', err) });
  res.status(202).json({});
});

server.listen(process.env.PORT);
debug('Server listening on port', process.env.PORT);
