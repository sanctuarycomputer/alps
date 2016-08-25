#!/usr/bin/env node

"use strict";
const fs         = require('fs');
const path       = require('path');
const cli        = require('cli');
const Alps       = require('./lib/Alps');
const rootPath   = path.resolve(process.cwd());
const configPath = `${rootPath}/alps.config.js`;

const VALID_COMMANDS = {
  init: 'Creates an alps.config.js in the current directory',
  install: 'Installs the selected projects',
  serve: 'Serves the selected projects',
  test: 'Runs tests against the selected projects',
  deploy: 'Deploys the selected projects'
};

const BOILERPLATE =`module.exports = {
  projects: []
};`;

try {
  let options = cli.parse({
    projects: ['p', 'Which projects to run against', 'string', 'all']
  }, VALID_COMMANDS);

  if (cli.command === 'init') {
    fs.stat(configPath, (err, stat) => {
      if (err === null) {
        Alps.log(`alps.config.js already exists in this directory.`, 'fatal');
      } else if (err.code == 'ENOENT') {
        fs.writeFile(configPath, BOILERPLATE);
        Alps.log(`alps.config.js was written to ${configPath}!`);
      } else {
        throw Error('init_unexpected_error');
      }
    });
  } else {
    fs.accessSync(configPath, fs.F_OK);
    const Config = require(configPath);
    Alps.validateConfig(Config, cli.command)
        .setup(Config.projects)
        .runCommand(cli.command, options)
        .then(() => Alps.log('Finished!'))
        .catch(error => Alps.log(error));
  }

} catch (e) {
  if (e.code && e.code === 'ENOENT') {
    Alps.log(`Could not find a valid alps.config.js in this directory. Have you run alps init?`, 'fatal');
  }

  switch(e.message) {
    case 'config_not_object':
      Alps.log(`The export from your alps.config.js must be an object.`, 'fatal');
      break;
    case 'config_projects_undefined':
      Alps.log(`The object exported from your alps.config.js does not contain a "projects" array.`, 'fatal');
      break;
    case 'config_projects_not_array':
      Alps.log(`The "projects" entry in your alps.config.js must be an array.`, 'fatal');
      break;
    case 'config_projects_empty':
      Alps.log(`Nothing to do! The "projects" array in your alps.config.js is empty.`, 'info');
      break;
    default:
      Alps.log(`An unexpected error occured: ${e}`, 'fatal');
  }
}

