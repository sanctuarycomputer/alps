"use strict";
const Project = require('./Project');

module.exports = class Phoenix extends Project {
  install() {
    return this.run('mix', ['deps.get']);
  }
  serve() {
    return this.run('mix', ['phoenix.server']);
  }
}
