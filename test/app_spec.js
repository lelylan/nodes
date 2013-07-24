var request = require('supertest')
	, mongoose = require('mongoose')
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

var Factory = require('factory-lady')
  , Device = require('../app/models/devices/device');

require('./factories/devices/device');


describe('MQTT Node',function() {

  var execute, lelylan, device;
  var payload = { properties: [{ id: 'property-1', value: 'on' }] };

  beforeEach(function() {
    nock.cleanAll();
    Device.find().remove()
  });

  beforeEach(function(done) {
    Factory.create('device', {}, function(doc) {
      device = doc;
      done();
    });
  });


	describe('when receives a subscribed notification',function() {

		beforeEach(function() {
			lelylan = nock('http://api.lelylan.com')
				.matchHeader('accept', 'application/json')
				.matchHeader('X-Physical-Secret', device.secret)
				.filteringRequestBody(function(path) { return '*' })
				.put('/devices/' + device.id + '/properties', '*')
				.reply(200, {});
		});

		beforeEach(function(done) {
			ascoltatori.build(settings, function(ascoltatore) {
				ascoltatore.publish('devices/' + device.id + '/set', payload);
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


	describe('when receives a PUT /mqtt/devices/:id',function() {

		beforeEach(function(done) {
			ascoltatori.build(settings, function() { done() });
		});

    describe('with valid x-device-secret header', function() {

      beforeEach(function() {
        execute = request(app)
          .put('/mqtt/devices/' + device.id)
          .set('Content-Type', 'application/json')
          .set('X-Physical-Secret', device.secret)
          .send(payload)
      });

      it('returns 202', function(done) {
        execute.expect(202).expect({ status: 202 }, done);
      });

      it('publish on /devices/:id/get', function(done) {
        async.series([
          function(cb) {
            ascoltatori.build(settings, function(ascoltatore) {
              ascoltatore.subscribe('devices/' + device.id + '/get', function() {
                expect(arguments['0']).to.be.equal('devices/' + device.id + '/get');
                expect(arguments['1']).to.be.like(payload)
                done()
              });
              cb();
            });
          },
          function(cb) {
            execute.expect(202, cb)
          }
        ]);
      });
    });

    describe('with no valid x-device-secret header', function() {

      beforeEach(function() {
        execute = request(app)
          .put('/mqtt/devices/' + device.id)
          .set('Content-Type', 'application/json')
          .set('X-Physical-Secret', 'not-valid')
          .send(payload)
      });

      it('returns 401', function(done) {
        execute.expect(401).expect({ status: 401 }, done);
      });

      it('does not publish on /devices/:id/get', function(done) {
        var spy = sinon.spy(ascoltatori, 'publish');
        async.series([
          function(cb) {
            execute.expect(401, cb)
          },
          function(cb) {
            expect(spy.callCount).to.have.eql(0);
            done();
          }
        ]);
      });
    });
	});
});
