"use strict";
const blessed = require('blessed');

module.exports = class Screen {
  constructor(projects, Alps) {
    this.Alps = Alps;
    this.screen = blessed.screen({ smartCSR: true });
    this.screen.key(['escape', 'q', 'C-c'], (ch, key) => {
      this.Alps.killAll();
    });
    this.projectsBox = this.appendProjectsBox();
    this.statusBox = this.appendStatusBox();
    this.boxes = projects.map((project, index) => this.appendProjectBox(project, index, projects.length));
    this.screen.render();
  }

  appendStatusBox() {
    let statusBox = blessed.box({
      bottom: 0,
      left: 0,
      align: 'center',
      valign: 'middle',
      width: '100%',
      height: 10,
      content: 'Working...'
    });
    this.screen.append(statusBox);
    return statusBox;
  }

  updateStatus(message, type) {
    this.statusBox.setContent(message);
  }

  appendProjectsBox() {
    let projectsBox = blessed.box({
      top: 0,
      left: 0,
      width: '100%',
      height: '100%-10',
      scrollable: true
    });
    this.screen.append(projectsBox);
    return projectsBox;
  }

  appendProjectBox(project, index, total) {
    let layout = {
      1: ['100x100-0x0'],
      2: ['50x100-0x0', '50x100-50x0'],
      3: ['50x50-0x0','50x50-50x0','100x50-0x50'],
      4: ['50x50-0x0','50x50-50x0','50x50-0x50','50x50-50x50'],
    }

    let coords  = layout[total][index].split('-')[0].split('x');
    let offsets = layout[total][index].split('-')[1].split('x');

    project.logBox = blessed.log({
      left: `${offsets[0]}%`,
      top: `${offsets[1]}%`,
      width: `${coords[0]}%`,
      height: `${coords[1]}%`,
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
