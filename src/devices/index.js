const devices = [
  {
    name: 'iPhone 8 Plus',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
    viewport: {
      'width': 414,
      'height': 736,
      'deviceScaleFactor': 3,
      'isMobile': true,
      'hasTouch': true,
      'isLandscape': false
    },
    innerHeight: 686,
    outerHeight: 736,
    pixelDepth: 32,
    hardwareConcurrency: undefined,
    maxTouchPoints: 5,
    "unmaskedvendor": "AppleInc",
    "unmaskedrenderer": "AppleGPU",
    vendor: 'AppleComputer,Inc.',
    platform: 'iPhone',
    mimeTypes: null,
    chrome: undefined,
    plugins: [],
    devices: [],
    widthfonts: ["Hoefler Text", "Georgia", "Trebuchet MS", "Verdana", "Courier New", "Courier"],
    heightfonts: ['GillSans', 'HelveticaNeue']
  },
  {
    name: 'iPhone 7',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
    viewport: {
      'width': 375,
      'height': 667,
      'deviceScaleFactor': 2,
      'isMobile': true,
      'hasTouch': true,
      'isLandscape': false
    },
    innerHeight: 553,
    outerHeight: 667,
    pixelDepth: 32,
    hardwareConcurrency: undefined,
    maxTouchPoints: 0,
    "unmaskedvendor": "AppleInc",
    "unmaskedrenderer": "AppleGPU",
    vendor: 'AppleComputer,Inc.',
    platform: 'iPhone',
    mimeTypes: null,
    chrome: undefined,
    plugins: [],
    widthfonts: ["Hoefler Text", "Georgia", "Trebuchet MS", "Verdana", "Courier New", "Courier"],
    heightfonts: ['GillSans', 'HelveticaNeue'],
    widthfonts: ["Hoefler Text", "Georgia", "Trebuchet MS", "Verdana", "Courier New", "Courier"],
    heightfonts: ['GillSans', 'HelveticaNeue']
  },
  {
    name: 'Oneplus 6',
    userAgent: 'Mozilla/5.0 (Linux; Android9; ONEPLUSA6000) AppleWebKit/537.36 (KHTML, likeGecko) Chrome/75.0.3770.101 MobileSafari/537.36',
    viewport: {
      'width': 412,
      'height': 869,
      'deviceScaleFactor': 2.625,
      'isMobile': true,
      'hasTouch': true,
      'isLandscape': false
    },
    innerHeight: 783,
    outerHeight: 783,
    pixelDepth: 24,
    hardwareConcurrency: 8,
    maxTouchPoints: 5,
    "unmaskedvendor": "Qualcomm",
    "unmaskedrenderer": "Adreno(TM)630",
    vendor: 'GoogleInc',
    platform: 'Linuxarmv8l',
    chrome: {
      csi: function () {

      },
      loadTimes: function () {

      },
      app: {

      }
    },
    mimeTypes: null,
    plugins: [],
    devices: [],
    widthfonts: ["Hoefler Text", "Georgia", "Trebuchet MS", "Verdana", "Courier New", "Courier"],
    heightfonts: ['GillSans', 'HelveticaNeue']
  },
]

module.exports = {
  getRandomDevice() {
    return devices[Math.floor(Math.random() * devices.length)];
  },
  getDeviceByName(name) {
    const device = devices.find(d => d.name == name);
    if (!device) throw `could not find device with name ${name}`;
    return device;
  }
}