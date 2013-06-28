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
  uri     = 'http://api.lelylan.com/devices/' + payload.id + '/properties';
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


// --------------
// CURL Examples
// --------------

// SET curl -X PUT http://localhost:8004/mqtt/devices/1/properties -H 'Content-Type: application/json' -H 'X-Physical-Secret: secret-1' -d '{ "id": "1", "properties": [{ "id": "<status>", "value": "on" }] }'
// GET curl -X PUT http://localhost:8004/mqtt/simulate -H 'Content-Type: application/json' -H 'X-Physical-Secret: secret-1' -d '{ "id": "1", "properties": [{ "id": "<status>", "value": "on" }] }'
