const puppeteer = require('puppeteer');

const devices = require('../devices');
const utils = require('../utils');
//block logging and fonts to save some network traffic
const blockList = ['client_event.json', '.woff'];

class Browser {
  constructor(info) {
    this.info = info;
  }
  async launchBrowser() {
    const args = [
      '--blink-settings=imagesEnabled=false' // no need to load images
    ]
    const userDataDir = await utils.ensureFolderExists(this.info.username); //create a folder for username if it does not exists
    const device = await this.getUserDevice(); //create a device for username or return already saved device
    const launchOptions = {
      defaultViewPort: false,
      userDataDir: userDataDir, // userDataDir to save session and prevent login each time
      args: args,
      devtools: true, // let's see what our bot is doing
      slowMo: true 
    }
    this.browser = await puppeteer.launch(launchOptions);
    this.page = (await this.browser.pages())[0];
    await this.page.setUserAgent(device.userAgent);
    await this.page.setViewport(device.viewport);
    await this.page.setRequestInterception(true);
    //intercept requests to block some of them, also nice to see create tweet request data
    this.page.on('request', async request => {
      try {
        const url = request.url();
        if (url.indexOf('CreateTweet') > -1) {
          const data = request.postData();
          console.log(`sending create tweet with data: ${data}`);
        }
        if (blockList.every(bl => url.indexOf(bl) == -1)) {
          request.continue();
        } else {
          request.abort();
        }
      } catch (err) {
        console.log(`page.on request error: ${err}`);
      }
    });
    //doesn't work well with twitter since it is a spa
    this.page.on('load', async () => {
      try {
        const pageTitle = await this.page.title();
        console.log(`navigated to ${pageTitle}`);
      } catch (err) {
        console.log(`page.on load error: ${err}`);
      }
    });
    // basic device emulation
    await this.page.evaluateOnNewDocument(device => {
      const navigatorProto = navigator.__proto__;
      delete navigatorProto.webdriver;
      navigator.__proto__ = navigatorProto; // no need to scream "I am a bot"
      Object.defineProperty(navigator, 'mimeTypes', {
        get: () => {
          return device.mimeTypes;
        }
      });
      Object.defineProperty(navigator, 'plugins', {
        get: () => {
          return device.plugins;
        }
      });
      Object.defineProperty(navigator, 'platform', {
        get: () => device.platform
      });
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        get: () => device.hardwareConcurrency
      });
      Object.defineProperty(screen, 'colorDepth', {
        get: () => device.pixelDepth
      });
      Object.defineProperty(screen, 'pixelDepth', {
        get: () => device.pixelDepth
      });
      Object.defineProperty(window, 'outerHeight', {
        get: () => device.outerHeight
      });
      Object.defineProperty(window, 'innerHeight', {
        get: () => device.innerHeight
      });
      Object.defineProperty(navigator, 'vendor', {
        get: () => device.vendor
      });
    }, device);
  }
  async getUserDevice() {
    const deviceName = await utils.readDeviceFile(this.info.username);
    if (deviceName) return devices.getDeviceByName(deviceName);
    const device = devices.getRandomDevice();
    await utils.writeDeviceFile(this.info.username, device.name)
    return device;
  }
  // kind of like waitForSelector but looks for elements with specified text instead
  // seems like twitter is using random generated class names so this is useful to have
  async waitForText(selector, text) {
    const waitFor = 30;
    for (let i = 0; i < waitFor; i++) {
      const element = await this.page.evaluate(info => {
        const elements = document.querySelectorAll(info.selector);
        for (let i = 0; i < elements.length; i++) {
          if (elements[i].innerText == info.text) return true;
        }
        return false;
      }, { selector, text });
      if (element) return;
      await utils.wait();
    }
    throw `${text} not found on page`;
  }
  // mainly to see the response for CreateTweet request
  async waitForResponse(partialUrl) {
    return new Promise((resolve, reject) => {
      const timeoutTimer = setTimeout(reject, 30000); // don't wait for more than 30 seconds
      this.page.on('response', async response => {
        try {
          const url = response.url();
          if (url.indexOf(partialUrl) > -1) {
            clearTimeout(timeoutTimer);
            console.log(`got ${partialUrl} response`);
            const text = await response.text();
            console.log(`${partialUrl} response: ${text}`);
            const result = JSON.parse(text);
            if (result.errors && Array.isArray(result.errors) && result.errors.length > 0) {
              reject(result.errors[0].message)
            } else {
              resolve();
            }
          }
        } catch (err) {
          console.log(`page.on response error: ${err}`);
          reject(err);
        }
      })
    })
  }
  //gets element with specified innerText
  //similar to page.$(selector), can be used where selectors are randomly generated and not very easy to get
  async getElementByText(selector, text) {
    const element = await this.page.evaluateHandle(info => {
      const elements = document.querySelectorAll(info.selector);
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].innerText == info.text) return elements[i];
      }
      return null;
    }, { selector, text })
    if (!element) throw `element with selector ${selector} and text ${text} not found on page`;
    return element;
  }
  async login() {
    console.log('starting login');
    const loginButton = await this.getElementByText('div', 'Sign in')
    await loginButton.click();
    await this.waitForText('span', 'Sign in to Twitter');
    const input = await this.page.$('input');
    if (!input) throw 'username input not found';
    await input.type(this.info.username);
    const nextButton = await this.getElementByText('div', 'Next');
    await nextButton.click();
    await this.waitForText('span', 'Enter your password');
    const passwordInput = await this.page.$('input[type=password]');
    if (!passwordInput) throw 'password input not found';
    await passwordInput.type(this.info.password);
    const submitPasswordButton = await this.getElementByText('span', 'Log in');
    await submitPasswordButton.click();
    await this.waitForText('span', 'Home');
    console.log('login completed successfully');
  }
  async tweet() {
    try {
      await this.launchBrowser();
      await this.page.goto('https://www.twitter.com');
      await Promise.race([this.waitForText('span', 'Sign in'), this.page.waitForSelector('[aria-label="Home"]'), this.page.waitForSelector('input')])
      await utils.wait(2);
      console.log('main page loaded');
      await this.page.evaluate(() => {
        const layers = document.getElementById('layers');
        if (layers) layers.style.display = 'none';
      })
      console.log('hiding layers');
      const loggedIn = await this.page.$('[aria-label="Home"]');
      if (!loggedIn) await this.login();
      console.log('clicking on new tweet button');
      const newTweetButton = await this.page.evaluate(() => {
        const links = document.querySelectorAll('a');
        for (let i = 0; i < links.length; i++) {
          if (links[i].href == 'https://mobile.twitter.com/compose/tweet') {
            links[i].click();
            return true;
          }
        }
        return false;
      })
      if (!newTweetButton) throw 'newTweetButton not found';
      await this.page.waitForSelector('textarea');
      const tweetInput = await this.page.$('textarea');
      if (!tweetInput) throw 'tweet input not found';
      console.log('tweet textarea found');
      const tweetButton = await this.getElementByText('span', 'Tweet');
      console.log('tweet button found');
      await tweetInput.click();
      await this.page.keyboard.type(this.info.tweet);
      console.log('sending tweet');
      await Promise.all([this.waitForResponse('CreateTweet'), tweetButton.click()]);
      console.log('tweet successful');
      return { success: true, text: 'tweet successful' }
    } catch (err) {
      console.log(`browser tweet error: ${err}`);
      return { success: false, text: `${err}` }
    } finally {
      if (this.browser) await this.browser.close();
    }
  }
  async getLastTweet() {
    try {
      await this.launchBrowser();
      await this.page.goto(`https://mobile.twitter.com/${this.info.username}`);
      await this.page.waitForSelector('article');
      const text = await this.page.evaluate(() => {
        const article = document.querySelector('article');
        if (!article) return null;
        const tweetContainer = article.querySelector('[data-testid="tweetText"]');
        if (!tweetContainer) return null;
        return tweetContainer.innerText;
      });
      console.log(`last tweet: ${text}`);
      return { success: true, text: text }
    } catch (err) {
      console.log(`browser getLastTweet error: ${err}`);
      return { success: false, error: `${err}` }
    } finally {
      if (this.browser) await this.browser.close();
    }
  }
}

module.exports = Browser;