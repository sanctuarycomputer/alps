#!/usr/bin/env node

"use strict";
const fs = require('fs');
const path = require('path');
const Alps = require('./lib/Alps');

const root = path.resolve(process.cwd());
const configPath = `${root}/alps.config.js`;

try {
  fs.accessSync(configPath, fs.F_OK);
  const Config = require(configPath);

  Alps.init(Config.projects)
      .install()
      .then(() => Alps.log('Finished!'))
      .catch(error => Alps.log(error));

} catch (e) {
  // TODO: The only errors here can be either doesn't exist or projects isn't defined
  console.log(e.code && e.code === 'ENOENT');
  console.log(e === "[TypeError: Cannot read property 'map' of undefined]");

  Alps.log(`Could not find a valid alps.config.js`);
  Alps.log(`Have you run "alps init" in this directory?`);
}

