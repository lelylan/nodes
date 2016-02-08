// libraries
var mongoose = require('mongoose')
  , express  = require('express')
  , app      = express()
  , server   = require('http').createServer(app)
  , request  = require('request')
  , debug    = require('debug')('lelylan')
  , Device   = require('./app/models/devices/device');

var mqtt = require('mqtt');

var host = process.env.MOSCA_HOST
  , port = '1883';

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
// ---------------

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
// ---------------

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html')
});


// -------------------------------------------
// From Lelylan to the Physical Device (/GET)
// -------------------------------------------

app.put('/mqtt/devices/:id', function(req, res) {
  var status = 401;
  debug('Receiving request', req.body);

  Device.findOne({ _id: req.params.id, secret: req.get('X-Physical-Secret') }, function (err, doc) {
    if (err) console.log(err.message);
    if (doc) {
      status = 202;
      publish(req, '/get/')

      // BAD HACK
      //var client = mqtt.createClient(port, host, { username: req.params.id, password: req.get('X-Physical-Secret') });
      //client.on('connect', function() {
        //client.publish('devices/' + req.params.id + '/get', JSON.stringify(req.body));
        //client.end();
      //})
    };

    res.status(status).json({status:status});
  });
});

var publish = function(req, mode) {
  // Needed to work with Redis (and Mosca default settings)
  // * Hex transformation for the JSON body
  // * Binary definition for Redis to understand the stored format type
  payload = { message: new Buffer(JSON.stringify(req.body)).toString('hex'), binary: true };
  var topic = 'devices/' + req.params.id + mode;
  ascoltatore.publish(topic, payload, function() {
    console.log('[API REQ] Message published to the topic', topic, payload);
  });
}


// -------------------------------------------
// From the Physical Device to Lelylan (/SET)
// -------------------------------------------

ascoltatori.build(settings, function (_ascoltatore) {
  ascoltatore = _ascoltatore;

  ascoltatore.subscribe('devices/*', function() {
    debug('TOPIC', arguments['0'], 'PAYLOAD', arguments['1']);
    var data = arguments['0'].split('/');
    if (data[2] == 'set')
      syncLelylan(data[1], arguments['1']);
  });
});

var syncLelylan = function(id, payload) {
  var uri = process.env.LELYLAN_API_URL + '/devices/' + id + '/properties';
  var json = JSON.parse(new Buffer(payload.message, 'hex').toString('utf8'));  // needed with Redis
  var options = { uri: uri, method: 'PUT', body: json, json: true };

	Device.findOne({ _id: id }, function (err, doc) {
		if (err) console.log('ERROR', err.message);

		if (doc) {
			options.headers = setHeaders(doc.secret);

			request(options, function(err, response, body) {
				if (err) console.log('ERROR', err.message);
				debug('Sent request to', uri, json)
			});
		}
  });
}

var setHeaders = function(secret) {
  return { 'X-Physical-Secret': secret, 'Content-Type': 'application/json' }
}

module.exports = app;
