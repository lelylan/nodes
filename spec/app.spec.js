var request = require('supertest')
  , app = require('../app')
  , ascoltatori = require("ascoltatori")
  , async = require("async")
  , chai = require("chai")
  , expect = require("chai").expect
  , sinon = require("sinon")
  , sinonChai = require("sinon-chai")
  , debug = require('debug')('test');
chai.use(sinonChai);

var execute
  , ascoltatore
  , settings = {
      type: 'mongo',
      uri: process.env.MONGOLAB_JOBS_HOST,
      db: process.env.MONGOLAB_JOBS_DB,
      pubsubCollection: 'mqtt',
      mongo: {} };

describe('MQTT node',function() {

  describe('PUT /devices/:id/properties/set',function() {

    beforeEach(function(done) {
      ascoltatori.build(settings, function() { done(); });
    });

    beforeEach(function() {
      execute = request(app)
        .put('/mqtt/devices/device-1/properties/set')
        .set('Content-Type', 'application/json')
        .set('X-Physical-Secret', 'secret-1')
        .send({ id: 'device-1', properties: [{ id: 'property-1', value: 'on'}] })
    });

    it('returns 202', function(done) {
      execute.expect(202).expect({ status: 202 }, done);
    });

    //it('publish on /mqtt/:secret/set', function(done) {
      //async.series([
        //function(cb) {
          //ascoltatori.build(settings, function(ascoltatore) {
            //ascoltatore.subscribe('mqtt/secret-1/set', done); cb();
          //});
        //},
        //function(cb) {
          //execute.expect(202, cb)
        //}
      //]);
    //});
  });
});
