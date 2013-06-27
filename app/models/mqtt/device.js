var mongoose = require('mongoose')
  , db = mongoose.createConnection(process.env.MONGOLAB_MQTT_URL);

var deviceSchema = new mongoose.Schema({
  device_id: String,
  secret: String
});

deviceSchema.static('findOrCreate', function(req, callback) {
  return this.findOneAndUpdate(
    { device_id: req.params.id },
    { secret: req.get('X-Physical-Secret') },
    { upsert: true }, callback);
});

module.exports = db.model('device', deviceSchema);
