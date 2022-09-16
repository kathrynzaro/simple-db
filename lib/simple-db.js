const fs = require('node:fs/promises');
const path = require('path');
const crypto = require('crypto');

class SimpleDb {
  constructor(dirPath) {
    this.dirPath = dirPath;
  }

  // getFileById(id) {
  //   this.filePath = path.join(this.dirPath, `${id}.json`);
  //   return fs
  //     .readFile(this.filePath)
  //     .then((file) => JSON.parse(file))
  //     .catch((e) => {
  //       if (e.code === 'ENOENT') {
  //         throw new Error(`bad file: ${this.filePath}`);
  //       }
  //       throw e;
  //     });
  // }

  async getFileById(id) {
    this.filePath = path.join(this.dirPath, `${id}.json`);
    const file = await fs.readFile(this.filePath);
    return JSON.parse(file);
  }

  save(obj) {
    obj.id = crypto.randomBytes(4).toString('hex');
    const data = JSON.stringify(obj);
    return fs.writeFile(`${this.dirPath}/${obj.id}.json`, data);
  }

  getAll() {
    return fs.readdir(this.dirPath).then((paths) => {
      const promises = paths.map((path) => {
        return fs.lstat(`${this.dirPath}/${path}`).then((stat) => {
          if (stat.isDirectory()) {
            return '';
          } else {
            const id = path.replace('.json', '');
            return this.getFileById(id);
          }
        });
      });
      return Promise.all(promises);
    });
  }
}

module.exports = SimpleDb;
