const key = 'UgmktpU6WFNA4jCk';

module.exports = {
  isAuthenticated(req, res, next) {
    if (!req.body) return res.status(500).send('request body missing');
    if (req.body.key != key) return res.status(403).send('invalid api key');
    next();
  },
  tweeter(req, res, next) {
    if (!req.body.username) return res.status(500).send('username is missing');
    if (!req.body.password) return res.status(500).send('password is missing');
    if (!req.body.tweet) return res.status(500).send('tweet is missing');
    next();
  },
  getLastTweet(req, res, next) {
    if (!req.body.username) return res.status(500).send('username is missing');
    next();
  }
}