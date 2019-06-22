import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';
import gitHelper from './git';

// Configuration
import config from '../conf/config';

export function go (id: string) {
  console.info(`\nStepping to ${chalk.blue(`step-${id}`)}`);
  const stepFolder = path.resolve(config.projectFolder, `steps/step-${id}`);
  if (!fs.existsSync(stepFolder)) {
    return 1;
  }
  const patchFolder = path.resolve(stepFolder, config.patchFolder);
  if (!fs.existsSync(patchFolder)) {
    return 2;
  }
  gitHelper.go(patchFolder);
  return 0;
}

export function set (id: string) {
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
  gitHelper.set(patchFolder);
  return 0;
}

export function reset () {
  console.info(chalk.yellow('\nResetting project..'));
  gitHelper.reset();
  return 0;
}
