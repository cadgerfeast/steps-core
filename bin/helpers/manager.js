const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const git = require('./git');

module.exports = {
  go: (id, config) => {
    console.info(`\nStepping to ${chalk.blue(`step-${id}`)}`);
    const stepFolder = path.resolve(config.projectFolder, `steps/step-${id}`);
    if (!fs.existsSync(stepFolder)) {
      return 1;
    }
    const patchFolder = path.resolve(stepFolder, config.patchFolder);
    if (!fs.existsSync(patchFolder)) {
      return 2;
    }
    git.go(patchFolder, config);
    return 0;
  },
  set: (id, config) => {
    console.info(`\nCreating patch for ${chalk.blue(`step-${id}`)}`);
    const stepsFolder = path.resolve(config.projectFolder, 'steps');
    if (!fs.existsSync(stepsFolder)) {
      fs.mkdirSync(stepsFolder);
    }
    const stepFolder = path.resolve(stepsFolder, `step-${id}`);
    if (!fs.existsSync(stepFolder)) {
      fs.mkdirSync(stepFolder);
    }
    const patchFolder = path.resolve(stepFolder, config.patchFolder);
    if (!fs.existsSync(patchFolder)) {
      fs.mkdirSync(patchFolder);
    }
    git.set(`step-${id}.patch`, patchFolder, config);
    return 0;
  },
  reset: () => {
    console.info(chalk.yellow('\nResetting project..'));
    git.reset();
    return 0;
  }
};
