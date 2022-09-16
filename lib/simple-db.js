const fs = require('node:fs/promises');
const path = require('path');
const crypto = require('crypto');

class SimpleDb {
  constructor(dirPath) {
    this.dirPath = dirPath;
  }

  getFileById(id) {
    this.filePath = path.join(this.dirPath, `${id}.json`);
    return fs
      .readFile(this.filePath)
      .then((file) => JSON.parse(file))
      .catch((e) => {
        if (e.code === 'ENOENT') {
          throw new Error(`bad file: ${this.filePath}`);
        }
        throw e;
      });
  }

  save(obj) {
    obj.id = crypto.randomBytes(4).toString('hex');
    const data = JSON.stringify(obj);
    return fs.writeFile(`${this.dirPath}/${obj.id}.json`, data);
  }
}

module.exports = SimpleDb;
