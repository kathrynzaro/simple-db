const fs = require('node:fs/promises');
const path = require('path');
const SimpleDb = require('../lib/simple-db');
const crypto = require('crypto');

const { CI, HOME } = process.env;
const BASE_DIR = CI ? HOME : __dirname;
const TEST_DIR = path.join(BASE_DIR, 'test-dir');

describe('simple database', () => {
  beforeEach(async () => {
    await fs.rm(TEST_DIR, { force: true, recursive: true });
    await fs.mkdir(TEST_DIR, { recursive: true });
  });

  it('gets file by id', async () => {
    const dinner = {
      name: 'burrito',
    };
    const id = crypto.randomBytes(8).toString('hex');
    await fs.writeFile(`${TEST_DIR}/${id}.json`, JSON.stringify(dinner));
    const db = new SimpleDb(TEST_DIR);
    const result = await db.getFileById(id);
    expect(result).toEqual(dinner);
  });

  it('saves', async () => {
    const dinner = {
      name: 'breakfast',
    };
    const db = new SimpleDb(TEST_DIR);
    await db.save(dinner);
    const res = await db.getFileById(dinner.id);
    expect(res).toEqual(dinner);
  });
});
