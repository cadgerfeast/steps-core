import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';
import { prompt } from 'enquirer';

// Internal dependencies
import * as managerHelper from './manager';
// Configuration
import config, { UserConfig } from '../conf/config';

export async function init () {
  // Validate Path
  let answers: EnquirerAnswers = await prompt({
    type: 'confirm',
    initial: true,
    name: 'validatePath',
    message: chalk.blue(`Generating steps in: ${chalk.white(config.projectFolder)}\n  ${chalk.green('Are you sure?')}`)
  });
  if (!answers.validatePath) {
    return 1;
  }
  const userConfig: UserConfig = {};
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
    validate (value: string): boolean | string {
      if (!value.match(/^[a-z0-9]+$/ui)) {
        return 'Only alphanumeric characters allowed.';
      }
      return true;
    },
    message: chalk.white('What is the patch folder name?')
  });
  userConfig.patchFolder = answers.patchFolder;
  // Write configuration
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
}

export async function go () {
  // get steps folder
  const stepChoices = managerHelper.getAvalaibleSteps().map(String);
  // no choices
  if (stepChoices.length === 0) {
    return 3;
  }
  // prompt select
  const answers: EnquirerAnswers = await prompt({
    type: 'select',
    name: 'selectGo',
    message: chalk.white('At which step do you want to go?'),
    choices: stepChoices
  });
  return managerHelper.go(answers.selectGo);
}
