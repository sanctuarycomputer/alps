"use strict";
const Project = require('./Project');

module.exports = class Rails extends Project {
  install() {
    return this.bundleCheck().catch(error => {
      return this.bundleInstall();
    });
  }
  serve() {
    return this.run('bundle', ['exec', 'rails', 'server']);
  }
  bundleCheck() {
    return this.run('bundle', ['check']);
  }
  bundleInstall() {
    return this.run('bundle', ['install']);
  }
}
