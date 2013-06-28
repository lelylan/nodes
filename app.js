var mongoose = require('mongoose')
  , express  = require('express')
  , app      = express()
  , server   = require('http').createServer(app)
  , request  = require('request')
  , debug    = require('debug')('lelylan');

var ascoltatori = require('ascoltatori')
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

server.listen(process.env.PORT, function() {
  debug('Server listening on port', process.env.PORT);
});


// ---------------
// Live page test
// ---------------

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html')
});


// --------------
// MQTT Services
// --------------

app.put('/mqtt/devices/:id/properties/set', function(req, res) {
  publish(req, '/set');
  res.status(202).json({status:202});
});

app.put('/mqtt/devices/:id/properties/get', function(req, res) {
  publish(req, '/get');
  res.status(202).json({});
});

var publish = function(req, mode) {
  var topic = 'mqtt/' + req.get('X-Physical-Secret') + mode;
  ascoltatore.publish(topic, req.body);
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
  uri = 'http://api.lelylan.com/devices/' + payload.id + '/properties';
  options = { uri: uri, method: 'PUT', headers: headers(payload), json: payload }

  request(options, function(err, response, body) {
    debug('-- Request sent to Lelylan');
    if (err) debug("ERROR", err.message);
    debug('SENT REQUEST TO LELYLAN DEVICE', payload.id)
  });
}

var headers = function(payload) {
  return { 'X-Physical-Secret': payload.secret, 'Content-Type': 'application/json' }
}

module.exports = app;
