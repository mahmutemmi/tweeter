const Browser = require('../scraper/browser.js');
module.exports = {
  async tweet(req, res) {
    try {
      const browser = new Browser(req.body);
      const result = await browser.tweet();
      res.send(result);
    } catch (err) {
      console.log(`TweetController tweet error: ${err}`);
      res.status(500).send('there was an error with you request, please try again later');
    }
  },
  async getLastTweet(req, res) {
    try {
      const browser = new Browser(req.body);
      const result = await browser.getLastTweet();
      res.send(result);
    } catch (err) {
      console.log(`TweetController getLastTweet error: ${err}`);
      res.status(500).send('there was an error with you request, please try again later');
    }
  }
}