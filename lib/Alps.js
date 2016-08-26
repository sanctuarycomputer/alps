"use strict";
const exec   = require('child_process').exec;
const cli    = require('cli');
const Screen = require('./Screen');

module.exports = {
  screen: null,
  projects: [],
  setup(projects, rootPath, cliOnly) {
    // this is where we'd create the screens for each project.
    this.projects = projects.map(project => {
      project.Alps = this;
      project.cwd = `${rootPath}/${project.name}`;
      return project;
    });
    if (!cliOnly) {
      this.screen = new Screen(this.projects);
    }
    return this;
  },
  validateConfig(Config, command) {
    if (typeof Config !== "object") { throw Error("config_not_object"); }
    if (typeof Config["projects"] === "undefined") { throw Error("config_projects_undefined"); }
    if (!Array.isArray(Config["projects"])) { throw Error("config_projects_not_array"); }
    if (Config["projects"].length === 0) { throw Error("config_projects_empty"); }
    return this;
  },
  log(message, type) {
    // error, fatal, info, ok
    let logType = type || 'ok';
    cli[logType](`🗻  ~~~~~~~~> ${message}`);
  },
  exec(command, cwd) {
    return new Promise((resolve, reject) => {
      exec(command.join(' '), { cwd }, (error, stdout, stderr) => {
        if (error) { reject({ error, stdout, stderr }); }
        if (stdout) { this.log(stdout); }
        if (stderr) { this.log(stderr); }
        resolve({ stdout, stderr });
      });
    });
  },
  runCommand(command) {
    return this[command].apply(this, arguments);
  },
  install() {
    return Promise.all(this.projects.map(project => {
      this.log(`Installing project: ${project.name}`);
      return project.install();
    }));
  },
  serve() {
    return Promise.all(this.projects.map(project => {
      return project.serve();
    }));
  },
  test() {
    return Promise.all(this.projects.map(project => {
      return project.test();
    }));
  },
  deploy() {
    return Promise.all(this.projects.map(project => {
      return project.deploy();
    }));
  }
}

