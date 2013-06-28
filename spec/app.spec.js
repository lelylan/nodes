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

  var makeFakeAscoltatore = function() {
    var r = {};
    r.publish = r.subscribe = r.unsubscribe = r.close = r.on =
    r.removeListener = r.registerDomain = function () {};
    return r;
  };

  describe('PUT /devices/:id/properties/set',function() {

    it('returns 202', function(done) {
      request(app)
        .put('/mqtt/devices/device-1/properties/set')
        .set('Content-Type', 'application/json')
        .set('X-Physical-Secret', 'secret-1')
        .send({ id: 'device-1', properties: [{ id: 'property-1', value: 'on'}] })
        .expect(202)
        .expect({ status: 202 }, done);
    });

    it('publish on topic /mqtt/:secret/set', function(done) {
      var ascoltatore = makeFakeAscoltatore();
      var spy = sinon.spy(ascoltatore, 'publish');

      async.series([
        function(cb) {
          request(app)
            .put('/mqtt/devices/device-1/properties/set')
            .set('Content-Type', 'application/json')
            .set('X-Physical-Secret', 'secret-1')
            .send({ id: 'device-1', properties: [{ id: 'property-1', value: 'on'}] })
            .expect(202, cb)
        },
        function(cb) {
          expect(spy).to.have.been.calledWith('/mqtt/secret-1/set');
          cb();
        }
      ], done);
    });
  });
});



//describe('when new event', function() {

  //var alice, bob, android, alice_token, bob_token, event;

  //beforeEach(function() {
    //helper.cleanDB();
    //nock.cleanAll();
  //});

  //beforeEach(function(done) { Factory.create('user', function(doc) { alice = doc; done() }); });
  //beforeEach(function(done) { Factory.create('user', function(doc) { bob   = doc; done() }); });
  //beforeEach(function(done) { Factory.create('application', function(doc) { android = doc; done() }); });

  //describe('when update device properties', function() {

    //beforeEach(function(done) {
      //Factory.create('access_token', {
        //resource_owner_id: alice.id,
        //application_id: android.id,
        //token: 'token-1'
      //}, function(doc) { alice_token = doc; done() })
    //});

    //beforeEach(function(done) {
      //Factory.create('access_token', {
        //resource_owner_id: bob.id,
        //application_id: android.id,
        //token: 'token-2'
      //}, function(doc) { bob_token = doc; done() })
    //});

    //beforeEach(function(done) {
      //Factory.create('event', {
        //resource_owner_id: alice.id,
      //}, function(doc) { event = doc; done() })
    //});

    //it('sets event#websocket_processed field as true', function(done) {
      //setTimeout(function() {
        //Event.findById(event.id, function(err, doc) { assert.equal(doc.websocket_processed, true); done(); });
      //}, 200);
    //});
  //});

  //describe('when does not update device properties', function() {

    //beforeEach(function(done) {
      //Factory.create('access_token', {
        //resource_owner_id: alice.id,
        //application_id: android.id,
        //token: 'token-1'
      //}, function(doc) { alice_token = doc; done() })
    //});

    //beforeEach(function(done) {
      //Factory.create('event', {
        //resource_owner_id: alice.id,
        //event: 'create'
      //}, function(doc) { event = doc; done() })
    //});

    //it('leave event#websocket_processed field as false', function(done) {
      //setTimeout(function() {
        //Event.findById(event.id, function(err, doc) { assert.equal(doc.websocket_processed, false); done(); });
      //}, 200);
    //});
  //});

//});
