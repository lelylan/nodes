var request = require('supertest')
  , app = require('../app')
  , ascoltatori = require('ascoltatori')
  , async = require('async')
  , chai = require('chai')
  , expect = require('chai').expect
  , sinon = require('sinon')
  , nock = require('nock')
  , debug = require('debug')('test');

chai.use(require('sinon-chai'));
chai.use(require('chai-fuzzy'));

var settings = {
  type: 'mongo',
  uri: process.env.MONGOLAB_JOBS_HOST,
  db: process.env.MONGOLAB_JOBS_DB,
  pubsubCollection: 'mqtt',
  mongo: {} };



describe('MQTT node',function() {

  var execute, lelylan;
  var payload = { id: 'device-1', properties: [{ id: 'property-1', value: 'on' }] };

  beforeEach(function() {
    nock.cleanAll();
  });

  describe('PUT /devices/:id/properties/set',function() {

    beforeEach(function(done) {
      ascoltatori.build(settings, function() { done() });
    });

    beforeEach(function() {
      execute = request(app)
        .put('/mqtt/devices/device-1/properties')
        .set('Content-Type', 'application/json')
        .set('X-Physical-Secret', 'secret-1')
        .send(payload)
    });

    it('returns 202', function(done) {
      execute.expect(202).expect({ status: 202 }, done);
    });

    it('publish on /mqtt/:secret/set', function(done) {
      async.series([
        function(cb) {
          ascoltatori.build(settings, function(ascoltatore) {
            ascoltatore.subscribe('mqtt/secret-1/set', function() {
              expect(arguments['0']).to.be.equal('mqtt/secret-1/set');
              expect(arguments['1']).to.be.like(payload)
              done()
            }); cb();
          });
        },
        function(cb) {
          execute.expect(202, cb)
        }
      ]);
    });
  });


  describe('MQTT message publishing',function() {

    beforeEach(function() {
      lelylan = nock('http://api.lelylan.com')
        .matchHeader('accept', 'application/json')
        .matchHeader('X-Physical-Secret', 'secret-1')
        .filteringRequestBody(function(path) { return '*' })
        .put('/devices/device-1/properties', '*')
        .reply(200, { id: 'device-1'});
    });

    beforeEach(function(done) {
      ascoltatori.build(settings, function(ascoltatore) {
        ascoltatore.publish('mqtt/secret-1/get', payload);
        done();
      });
    });

    it('sends a request to lelylan', function(done) {
      async.until(
        function() {
          return lelylan.isDone();
        },
        function(callback) {
          setTimeout(callback, 1);
        }, done);
    });
  });
});
