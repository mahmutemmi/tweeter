const fs = require('fs');
const path = require('path');

module.exports = {
  ensureParentFoldersExists() {
    try {
      const deviceFolder = path.join(__dirname, '..', '..', 'userdevice');
      const dataFolder = path.join(__dirname, '..', '..', 'userdata');
      fs.mkdirSync(deviceFolder);
      fs.mkdirSync(dataFolder);
    } catch (err) {
      console.log('folders already exists so np');
    }
  },
  ensureFolderExists(name) {
    return new Promise((resolve, reject) => {
      const folder = path.join(__dirname, '..', '..', 'userdata', name);
      fs.mkdir(folder, { recursive: true }, err => {
        if (err) return reject(err);
        resolve(folder);
      })
    })
  },
  readDeviceFile(name) {
    return new Promise(resolve => {
      const location = path.join(__dirname, '..', '..', 'userdevice', name);
      fs.readFile(location, 'utf8', (err, data) => {
        if (err) return resolve();
        resolve(data);
      })
    });
  },
  writeDeviceFile(name, info) {
    return new Promise((resolve, reject) => {
      const location = path.join(__dirname, '..', '..', 'userdevice', name);
      fs.writeFile(location, info, 'utf8', err => {
        if (err) return reject(err);
        resolve();
      })
    });
  },
  wait(seconds = 1) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000))
  }
}