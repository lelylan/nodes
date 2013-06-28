var request = require('supertest')
  , app = require('../app')
  , ascoltatori = require("ascoltatori")
  , async = require("async")
  , chai = require("chai")
  , expect = require("chai").expect
  , sinon = require("sinon")
  , sinonChai = require("sinon-chai");

chai.use(sinonChai);


describe('MQTT',function() {

  describe('PUT /devices/:id/properties/set',function() {

    var execute = request(app)
      .put('/mqtt/devices/device-1/properties/set')
      .set('Content-Type', 'application/json')
      .set('X-Physical-Secret', 'secret-1')
      .send({ id: 'device-1', properties: [{ id: 'property-1', value: 'on'}] })

    it('returns 202', function(done) {
      execute.expect(202).expect({ status: 202 }, done);
    });

    it('publish on topic /mqtt/:secret/set', function() {
      // TODO
    });
  });
});
