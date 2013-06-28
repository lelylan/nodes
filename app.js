var mongoose = require('mongoose')
  , express  = require('express')
  , app      = express()
  , server   = require('http').createServer(app)
  , request  = require('request')
  , debug    = require('debug')('lelylan');

var Device = require('./app/models/mqtt/device')
  , ascoltatori = require('ascoltatori')
  , ascoltatore;

var settings = {
    uri: process.env.MONGOLAB_JOBS_HOST,
    db: process.env.MONGOLAB_JOBS_DB,
    pubsubCollection: 'mqtt',
    mongo: {}
  };


// ---------------
// Express Server
// ---------------

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/app/assets'))
});

server.listen(process.env.PORT);
debug('Server listening on port', process.env.PORT);


// ----------
// Live test
// ----------

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html')
});


// --------------
// MQTT Services
// --------------

app.put('/mqtt/devices/:id/properties', function(req, res) {
  publish(req);
  res.status(202).json({});
});

app.put('/mqtt/simulate', function(req, res) {
  publish(req, '/get');
  res.status(202).json({});
});

var publish = function(req, mode) {
  var mode  = mode ? '/get' : '/set'
  var topic = 'mqtt/' + req.get('X-Physical-Secret') + mode;
  ascoltatore.publish(topic, req.body.properties);
  Device.findOrCreate(req, function(err, doc) {
    if (err) debug('Error', err)
    debug('DOCUMENT', doc);
  });
}


// -------------
// Ascoltatori
// -------------

ascoltatori.build(settings, function (_ascoltatore) {
  ascoltatore = _ascoltatore;

  ascoltatore.subscribe('mqtt/*', function() {
    debug('-- Receving subscription payload');
    debug('TOPIC', arguments['0']);
    debug('PAYLOAD', arguments['1']);

    var data = arguments['0'].split('/');
    if (data[2] == 'get') sync(data[1], arguments['1']);
  });
});


// --------------------
// Send req to Lelylan
// --------------------

var sync = function(secret, payload) {
  Device.findOne({ secret: secret }, function (err, _device) {
    if (err) debug("ERROR", err.message);
    var device = _device;

    uri = 'http://api.lelylan.com/devices/' + device.device_id + '/properties';
    options = { uri: uri, method: 'PUT', headers: headers(device), json: payload }

    request(options, function(err, response, body) {
      debug('-- Request sent to Lelylan');
      if (err) debug("ERROR", err.message);
      debug('SENT REQUEST TO LELYLAN', device.device_id)
      debug('BODY', body)
    });
  });
}

var headers = function(device) {
  return { 'X-Physical-Secret': device.secret, 'Content-Type': 'application/json' }
}
