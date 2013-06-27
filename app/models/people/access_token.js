var mongoose = require('mongoose')
  , db = mongoose.createConnection(process.env.MONGOLAB_PEOPLE_URL);

var accessTokenSchema = new mongoose.Schema({
  resource_owner_id: mongoose.Schema.Types.ObjectId,
  application_id: mongoose.Schema.Types.ObjectId,
  revoked_at: Date,
  scopes: String,
  token: String,
  device_ids: { type: Array, default: [] }
});

module.exports = db.model('oauth_access_token', accessTokenSchema);
