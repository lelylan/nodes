// nodetime monitoring
require('nodetime').profile({ appName: 'lelylan-nodes', accountKey: '030a1222bf8efceac3d583c62c31c5ae47ce1633' });
setInterval(function() { require('request')('http://nodes.lelylan.com'); }, 360000);

// libraries
var mongoose = require('mongoose')
  , express  = require('express')
  , app      = express()
  , server   = require('http').createServer(app)
  , request  = require('request')
  , debug    = require('debug')('lelylan')
  , Device   = require('./app/models/devices/device');

var ascoltatori = require('ascoltatori')
  , ascoltatore;

var settings = {
  type: 'redis',
  redis: require('redis'),
  db: 12,
  port: 6379,
  return_buffers: true,
  host: process.env.REDIS_HOST
};


// ---------------
// Express Server

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/app/assets'))
});

server.listen(process.env.PORT, function() {
  debug('Nodes server listening on port', process.env.PORT);
});


// ---------------
// Live page test

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html')
});


// -----------------------------------
// MQTT node -> publish to the device

app.put('/mqtt/devices/:id', function(req, res) {
  var status = 401;
  debug('Receiving request');

  Device.findOne({ _id: req.params.id, secret: req.get('X-Physical-Secret') }, function (err, doc) {
    if (err) console.log(err.message);
    if (doc) { status = 202; publish(req, '/get') };

    res.status(status).json({status:status});
  });
});

var publish = function(req, mode) {
  var topic = 'devices/' + req.params.id + mode;
  debug('[API REQ] Publishing topic', topic, req.body);
  ascoltatore.publish(topic, req.body);
}


// --------------------------------------
// MQTT node <- subscribe to the devices

ascoltatori.build(settings, function (_ascoltatore) {
  ascoltatore = _ascoltatore;

  ascoltatore.subscribe('devices/*', function() {
    debug('[PHYSICAL REQ] Publishing topic', topic, req.body);
    debug('TOPIC', arguments['0'], 'PAYLOAD', arguments['1']);

    var data = arguments['0'].split('/');
    if (data[2] == 'set') syncLelylan(data[1], arguments['1']);
  });
});

var syncLelylan = function(id, payload) {
  var uri = process.env.LELYLAN_API_URL + '/devices/' + id + '/properties';
  var options = { uri: uri, method: 'PUT', json: payload }

	Device.findOne({ _id: id }, function (err, doc) {
		if (err) console.log('ERROR', err.message);

		if (doc) {
			options.headers = setHeaders(doc.secret);

			request(options, function(err, response, body) {
				if (err) console.log('ERROR', err.message);
				debug('Sent request to', uri)
			});
		}
  });
}

var setHeaders = function(secret) {
  return { 'X-Physical-Secret': secret, 'Content-Type': 'application/json' }
}

module.exports = app;
