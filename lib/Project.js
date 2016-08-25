"use strict";
module.exports = class Project {
  constructor(name) { this.name = name; }
  exec(command) { return this.Alps.exec(command, this.cwd); }
  log(message) { return this.Alps.log(message) }
  install() { return this.log(`Install not implemented for project: ${this.name}`); }
  serve() { return this.log(`Serve not implemented for project: ${this.name}`); }
  test() { return this.log(`Test not implemented for project: ${this.name}`); }
  deploy() { return this.log(`Deploy not implemented for project: ${this.name}`); }
}
