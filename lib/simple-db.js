const fs = require('node:fs/promises');
const path = require('path');

class SimpleDb {
  constructor(dirPath) {
    this.dirPath = dirPath;
  }

  get(id) {
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
}

module.exports = SimpleDb;
