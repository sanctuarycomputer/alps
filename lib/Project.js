"use strict";
const spawn = require('child_process').spawn;

module.exports = class Project {
  constructor(name) { this.name = name; }

  install() { return this.log(`Install not implemented for project: ${this.name}`); }
  serve() { return this.log(`Serve not implemented for project: ${this.name}`); }
  test() { return this.log(`Test not implemented for project: ${this.name}`); }
  deploy() { return this.log(`Deploy not implemented for project: ${this.name}`); }

  log(message) {
    if (this.logBox) {
      this.logBox.log(message);
    } else {
      this.Alps.log(message)
    }
  }

  run(command, args) {
    let commandArgs = args || [];
    this.log(`Running: ${command} ${commandArgs.join(' ')}`);
    return new Promise((resolve, reject) => {
      let process = spawn(command, commandArgs, { cwd: this.cwd });
      this.process = process;
      process.stdout.on('data', data => this.log(data.toString()));
      process.stderr.on('data', data => this.log(data.toString()));
      process.on('exit', code => {
        this.process.kill();
        if (code) {
          this.log(`Errored: ${command} ${commandArgs.join(' ')}`);
          reject();
        } else {
          this.log(`Success: ${command} ${commandArgs.join(' ')}`);
          resolve();
        }
      });
    });
  }
}
