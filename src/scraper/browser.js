const puppeteer = require('puppeteer');

const devices = require('../devices');
const utils = require('../utils');
const blockList = [];

class Browser {
  constructor(info) {
    this.info = info;
  }
  async launchBrowser() {
    const args = [
      '--blink-settings=imagesEnabled=false'
    ]
    const userDataDir = await utils.ensureExists(this.info.username);
    const device = this.getUserDevice();
    const launchOptions = {
      defaultViewPort: false,
      userDataDir: userDataDir,
      args: args
    }
    this.browser = await puppeteer.launch(launchOptions);
    this.page = (await this.browser.pages())[0];
    await this.page.setRequestInterception(true);
    this.page.on('request', async request => {
      try {
        const url = request.url();
        if (blockList.every(bl => url.indexOf(bl) == -1)) {
          request.continue();
        } else {
          request.abort();
        }
      } catch (err) {
        console.log(`page.on request error: ${err}`);
      }
    });
    this.page.on('load', async () => {
      try {
        const pageTitle = await this.page.title();
        console.log(`navigated to ${pageTitle}`);
      } catch (err) {
        console.log(`page.on load error: ${err}`);
      }
    });
    await this.page.evaluateOnNewDocument(device => {
      const navigatorProto = navigator.__proto__;
      delete navigatorProto.webdriver;
      navigator.__proto__ = navigatorProto;
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
      Object.defineProperty(window.history, 'length', {
        get: () => historyLength
      });
      Object.defineProperty(navigator, 'vendor', {
        get: () => device.vendor
      });
    }, device);
  }
  async getUserDevice() {
    const deviceName = await utils.readFile(this.info.username);
    if (deviceName) return devices.getDeviceByName(deviceName);
    const device = devices.getRandomDevice();
    await utils.writeFile(this.info.username, device.name)
    return device;
  }
  waitForText(text) {

  }
  async login() {
    const loginButton = await this.page.evaluateHandle(() => {
      const divs = document.querySelectorAll('div');
      for (let i = 0; i < divs.length; i++) {
        if (divs[i].innerText === 'Sign in') {
          return divs[i];
        }
      }
      return null;
    });
    if (!loginButton) throw 'Login button not found';
    await loginButton.click();
    await this.waitForText('Sign in to Twitter');
  }
  async tweet() {
    await this.launchBrowser();
    await this.page.goto('https://www.twitter.com');
    const loggedIn = await this.page.evaluate(() => {
      const accountButton = document.querySelector('[aria-label="Account menu"]');
      if (accountButton) return true;
      return false;
    });
    if (!loggedIn) await this.login();

  }
  async getLastTweet() {

  }
}

module.exports = Browser;