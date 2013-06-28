var Event        = require('../app/models/jobs/event')
  , User         = require('../app/models/people/user')
  , Application  = require('../app/models/people/application')
  , AccessToken  = require('../app/models/people/access_token');

// Remove all content on the used collections. Right now this is made only when the library
// is imported. Could be useful to create a function that can be called whenever you need it
// from the test suite to have a free of errors environment.
exports.cleanDB = function() {
  AccessToken.find().remove()
  User.find().remove()
  Application.find().remove()
};

// Set the event :realtime_processed field as true
exports.processed = function(event) {
  event.websocket_processed = true;
  event.save();
};
