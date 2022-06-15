const Browser = require('../scraper/browser.js');
module.exports = {
  async tweet(req, res) {
    try {
      const browser = new Browser(req.body);
      const result = await browser.tweet();
      if (!result.success) throw result.text;
      res.send(result);
    } catch (err) {
      console.log(`TweetController tweet error: ${err}`);
      res.status(500).send(`${err}`); // just return the error back, easier for debug
    }
  },
  async getLastTweet(req, res) {
    try {
      const browser = new Browser(req.body);
      const result = await browser.getLastTweet();
      if (!result.success) throw result.text;
      res.send(result);
    } catch (err) {
      console.log(`TweetController getLastTweet error: ${err}`);
      res.status(500).send(`${err}`);
    }
  }
}