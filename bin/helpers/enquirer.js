const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const { prompt, NumberPrompt } = require('enquirer');

const manager = require('./manager');

module.exports = {
  init: async (config) => {
    // Validate Path
    let answers = await prompt({
      type: 'confirm',
      initial: true,
      name: 'validatePath',
      message: chalk.blue(`Generating steps in: ${chalk.white(config.projectFolder)}\n  ${chalk.green('Are you sure?')}`)
    });
    if (!answers.validatePath) {
      return 1;
    }
    const userConfig = {};
    answers = await prompt({
      type: 'input',
      initial: './',
      name: 'srcPath',
      message: chalk.white('What is the src folder?')
    });
    userConfig.srcFolder = answers.srcPath;
    answers = await prompt({
      type: 'input',
      initial: 'patch',
      name: 'patchFolder',
      validate (value) {
        if (!value.match(/^[a-z0-9]+$/ui)) {
          return 'Only alphanumeric characters allowed.';
        }
        return true;
      },
      message: chalk.white('What is the patch folder name?')
    });
    userConfig.patchFolder = answers.patchFolder;
    fs.writeFileSync(path.resolve(config.projectFolder, 'steps.config.json'), JSON.stringify(userConfig, null, 2));
    const stepsPath = path.resolve(config.projectFolder, 'steps');
    if (!fs.existsSync(stepsPath)) {
      console.info(chalk.blue('Generating steps folder.'));
      fs.mkdirSync(stepsPath);
      const step0Path = path.resolve(stepsPath, 'step-0');
      fs.mkdirSync(step0Path);
      fs.writeFileSync(path.resolve(step0Path, 'README.md'), '# step-0');
      const step0PatchPath = path.resolve(step0Path, userConfig.patchFolder);
      fs.mkdirSync(step0PatchPath);
      fs.writeFileSync(path.resolve(step0PatchPath, 'dummy.md'), '# Dummy file.');
    }
    return 0;
  },
  go: async (config) => {
    const prompt = new NumberPrompt({
      name: 'number',
      message: 'At which step do you want to go ?'
    });
    const result = await prompt.run();

    // return go result
    return manager.go(result, config);
  }
};