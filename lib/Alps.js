"use strict";
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
      this.screen = new Screen(this.projects, this);
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

  killAll() {
    this.projects.forEach(project => project.kill());
    process.kill(0);
  },

  log(message, type) {
    // error, fatal, info, ok
    let logType = type || 'ok';
    if (this.screen) {
      this.screen.updateStatus(message, logType);
    } else {
      cli[logType](`🗻  ~~~~~~~~> ${message}`);
    }
  },
  runCommand(command) {
    return this[command].apply(this, arguments);
  },


  install() {
    return Promise.all(this.projects.map(project => {
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

