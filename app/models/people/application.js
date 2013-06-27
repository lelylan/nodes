var mongoose = require('mongoose')
  , db = mongoose.createConnection(process.env.MONGOLAB_PEOPLE_URL);

var applicationSchema = new mongoose.Schema({
  secret: String
});

module.exports = db.model('oauth_application', applicationSchema);
