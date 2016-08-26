"use strict";
const Project = require('./Project');

module.exports = class Node extends Project {
  install() {
    return this.npmInstall();
  }
  serve() {
    return this.npmStart();
  }
  npmInstall() {
    return this.run('npm', ['install', '--progress=false', '--loglevel=info']);
  }
  npmStart() {
    return this.run('npm', ['start']);
  }
}
