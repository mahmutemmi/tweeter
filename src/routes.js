const TweeterController = require('./controllers/TweeterController.js');
const validation = require('./validation.js');

module.exports = app => {
  app.post('/tweet', validation.isAuthenticated, validation.tweeter, TweeterController.tweet);
  app.post('/get-last-tweet', validation.isAuthenticated, validation.tweeter, TweeterController.getLastTweet);
}