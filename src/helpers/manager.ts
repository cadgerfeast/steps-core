import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';

import gitHelper from './git';
import storageHelper from './storage';

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

  // if anything is ok then save the current step id
  storageHelper.storeCurrentStepId(+id);

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

export async function next () {
  // get the current step
  let currentStepId: number = await storageHelper.getCurrentStepId();
  // no current step => assuming we are step-0
  if (currentStepId == null) {
    currentStepId = 0;
  }
  // get all steps
  const stepChoices: number[] = getAvalaibleSteps();

  if (stepChoices.length === 0) {
    return 3; // no step to go
  }

  // get the next step avalaible
  const nextStepId = stepChoices.find((step) => step > currentStepId);
  if (nextStepId == null) {
    return 4; // already in final step
  }

  return go(String(nextStepId));
}

export async function previous () {
  // get the current step
  let currentStepId: number = await storageHelper.getCurrentStepId();
  // no current step => assuming we are step-0
  if (currentStepId == null) {
    currentStepId = 0;
  }
  // get all steps
  const stepChoices: number[] = getAvalaibleSteps();

  if (stepChoices.length === 0) {
    return 3; // no step to go
  }

  stepChoices.reverse();
  // get the next step avalaible
  const nextStepId = stepChoices.find((step) => step < currentStepId);
  if (nextStepId == null) {
    return 5; // already in the first step
  }

  return go(String(nextStepId));
}

export function getAvalaibleSteps (): number[] {
  const stepChoices: number[] = [];
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
          stepChoices.push(+fileName.replace('step-', ''));
        }
      }
    });
    return stepChoices;
  } catch (err) {
    // error while getting path
    return [];
  }
}
