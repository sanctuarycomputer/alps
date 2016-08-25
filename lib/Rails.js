"use strict";
const Project = require('./Project');

module.exports = class Rails extends Project {
  install() {
    return this.bundleCheck().catch(error => {
      if ((error.stdout||'').includes('Install missing gems')) { return this.bundleInstall(); }
      throw error;
    });
  }
  serve() {
    return this.exec(['bundle', 'exec', 'rails', 'server', '-d']);
  }
  bundleCheck() {
    return this.exec(['bundle', 'check']);
  }
  bundleInstall() {
    this.Alps.log(`Running Bundle Install for Project: ${this.name}`)
    return this.exec(['bundle', 'install']);
  }
}
