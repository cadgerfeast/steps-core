const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const fsUtils = require('../utils/fs');

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
    fsUtils.copyFolderSync(patchFolder, config.srcFolder, false);
    return 0;
  }
};
