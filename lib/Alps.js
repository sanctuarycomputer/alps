const exec = require('child_process').exec;

module.exports = {
  projects: [],
  init(projects) {
    // this is where we'd create the screens for each project.
    this.projects = projects.map(project => {
      project.Alps = this;
      project.cwd = `${__dirname}/${project.name}`;
      return project;
    });
    return this;
  },
  log(message) {
    console.log(`🗻  ~~~~~~~~> ${message}`);
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
  install() {
    return Promise.all(this.projects.map(project => {
      this.log(`Installing project: ${project.name}`);
      return project.install();
    }));
  },
  serve() {
    return Promise.all(this.projects.map(project => {
      this.log(`Serving project: ${project.name}`);
      return project.serve();
    }));
  },
  test() {
    return Promise.all(this.projects.map(project => {
      this.log(`Testing project: ${project.name}`);
      return project.test();
    }));
  },
  deploy() {
    return Promise.all(this.projects.map(project => {
      this.log(`Deploying project: ${project.name}`);
      return project.deploy();
    }));
  }
}

