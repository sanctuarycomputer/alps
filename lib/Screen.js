"use strict";
const blessed = require('blessed');

module.exports = class Screen {
  constructor(projects, Alps) {
    this.Alps = Alps;
    this.screen = blessed.screen({ smartCSR: true });
    this.screen.key(['escape', 'q', 'C-c'], (ch, key) => process.exit(0));
    this.projectsBox = this.appendProjectsBox();
    this.boxes = projects.map((project, index) => this.appendProjectBox(project, index, projects.length));
    this.screen.render();
  }

  appendProjectsBox() {
    let projectsBox = blessed.box({
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    });
    this.screen.append(projectsBox);
    return projectsBox;
  }

  appendProjectBox(project, index, total) {
    let offset = '0%';
    if (index > 0) {
      offset = '50%';
    }
    project.logBox = blessed.log({
      top: 'center',
      left: offset,
      width: '50%',
      height: '100%',
      padding: { top: 1, left: 2 },
      label: ` ${project.name} (${project.constructor.name}) `,
      scrollable: true,
      alwaysScroll: true,
      border: { type: 'line' },
    });
    this.projectsBox.append(project.logBox);
    return project.logBox;
  }

}
