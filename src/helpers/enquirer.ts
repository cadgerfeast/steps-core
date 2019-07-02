import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';
import mustache from 'mustache';
import { prompt } from 'enquirer';

// Internal dependencies
import * as managerHelper from './manager';
// Configuration
import config, { UserConfig } from '../conf/config';
// I18n
import i18n from './i18n';

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
  // Src path
  answers = await prompt({
    type: 'input',
    initial: './',
    name: 'srcPath',
    message: chalk.white('What is the src folder?')
  });
  userConfig.srcFolder = answers.srcPath;
  // Localization
  answers = await prompt({
    type: 'multiselect',
    initial: ['en-gb'],
    name: 'lang',
    message: chalk.white('Which langs will be supported?'),
    choices: [
      { name: 'en-gb' },
      { name: 'fr-fr' }
    ],
    onSubmit: function () {
      if ((this as any).selected.length === 0) {
        (this as any).enable((this as any).focused);
      }
    }
  } as any);
  userConfig.lang = answers.lang;
  // Number of steps
  answers = await prompt({
    type: 'input',
    initial: 1,
    name: 'nbSteps',
    validate (value: string): boolean | string {
      if (!value.match(/^[0-9]+$/ui)) {
        return 'Please enter a integer.';
      }
      return true;
    },
    message: chalk.white(`How many steps do you want? (${chalk.green('Steps can be added later')})`)
  });
  const nbSteps = parseInt(answers.nbSteps, 10);
  // Patch folder name
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
    for (let i = 0; i < nbSteps; i++) {
      const stepPath = path.resolve(stepsPath, `step-${i}`);
      fs.mkdirSync(stepPath);
      for (const lang of userConfig.lang) {
        const langPath = path.resolve(stepPath, lang);
        fs.mkdirSync(langPath);
        const readmeTpl = fs.readFileSync(path.resolve(__dirname, '../templates/README.md'), 'utf8');
        const fileContent = mustache.render(readmeTpl, {
          id: i,
          previousId: i - 1,
          nextId: i + 1,
          previous: (i !== 0),
          next: (i !== nbSteps - 1),
          lang: lang,
          i18n: i18n(lang)
        });
        fs.writeFileSync(path.resolve(langPath, 'README.md'), fileContent);
      }
    }
  } else {
    return 2;
  }
  return 0;
}

export async function go () {
  // get steps folder
  const stepChoices: string[] = [];
  try {
    const stepsFolder = path.resolve(config.projectFolder, 'steps');
    // get all dir under the steps folder
    const files = fs.readdirSync(stepsFolder);
    files.forEach((fileName) => {
      // for each folder beginning by step
      if (fileName.startsWith('step')) {
        const patchFolder = path.resolve(stepsFolder, `${fileName}/${config.patchFolder}`);
        // only if patch folder exits in step folder
        if (fs.existsSync(patchFolder)) {
          // remove beginning of folder name, to get only the step id
          stepChoices.push(fileName.replace('step-', ''));
        }
      }
    });
  } catch (err) {
    // error while getting path
    return 3;
  }

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
