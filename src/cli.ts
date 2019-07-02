// External dependencies
import chalk from 'chalk';
import minimist from 'minimist';

// Internal dependencies
import * as enquirerHelper from './helpers/enquirer';
import * as managerHelper from './helpers/manager';
import * as tourHelper from './helpers/tour';
import gitHelper from './helpers/git';
import { getDoc } from './helpers/doc';

// Args
const args = minimist(process.argv.slice(2));

export default async () => {
  // Commands
  switch (args._[0]) {
    case 'init':
      if (args.help) {
        console.info(getDoc('init'));
      } else {
        const status = await enquirerHelper.init();
        switch (status) {
          case 1:
            console.info(chalk.yellow('  Canceled.'));
            break;
          default:
          case 0:
            console.info(chalk.green('\n  Success.'));
            break;
        }
      }
      break;
    case 'reset':
      if (args.help) {
        console.info(getDoc('reset'));
      } else if (!gitHelper.hasGit) {
        console.error(chalk.red('Git is not installed on the system, cannot use steps.'));
      } else {
        managerHelper.reset();
      }
      break;
    case 'go':
      if (args.help) {
        console.info(getDoc('go'));
      } else if (typeof args._[1] === 'undefined') {
        const status = await enquirerHelper.go();
        handleGoResponse(status);
      } else if (!gitHelper.hasGit) {
        console.error(chalk.red('Git is not installed on the system, cannot use steps.'));
      } else {
        const status = managerHelper.go(args._[1]);
        handleGoResponse(status);
      }
      break;
    case 'set':
      if (args.help || typeof args._[1] === 'undefined') {
        console.info(getDoc('set'));
      } else if (!gitHelper.hasGit) {
        console.error(chalk.red('Git is not installed on the system, cannot use steps.'));
      } else {
        managerHelper.set(args._[1]);
      }
      break;
    case 'serve':
      if (args.help) {
        console.info(getDoc('serve'));
      } else {
        await tourHelper.serve();
      }
      break;
    case 'next':
      if (args.help) {
        console.info(getDoc('next'));
      } else {
        const status = await managerHelper.next();
        handleNextPreviousResponse(status);
      }
      break;
    case 'previous':
      if (args.help) {
        console.info(getDoc('previous'));
      } else {
        const status = await managerHelper.previous();
        handleNextPreviousResponse(status);
      }
      break;
    default:
      console.info(getDoc('core'));
      break;
  }
};

function handleGoResponse (status: number) {
  switch (status) {
    case 1:
      console.error(chalk.red('Failed, specified step does not exist.'));
      break;
    case 2:
      console.warn(chalk.yellow('No patch folder found for this step.'));
      break;
    case 3:
      console.warn(chalk.yellow('No step to go.'));
      break;
    default:
    case 0:
      console.info(chalk.green('Success.'));
      break;
  }
}

function handleNextPreviousResponse (status: number) {
  switch (status) {
    case 4:
      console.warn(chalk.red('You already are in the final working step!'));
      return;
    case 5:
      console.warn(chalk.red('You already are in the first working step!'));
      return;
  }
  // next/previous ok
  handleGoResponse(status);
}
