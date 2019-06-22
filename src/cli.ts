// External dependencies
import chalk from 'chalk';
import minimist from 'minimist';

// Internal dependencies
import * as enquirerHelper from './helpers/enquirer';
import * as managerHelper from './helpers/manager';
import gitHelper from './helpers/git';
import { getDoc } from './helpers/doc';

// Args
const args = minimist(process.argv.slice(2));

export default async () => {
  // Commands
  switch (args._[0]) {
    case 'debug':
      console.info('hello there');
      break;
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
        const status = await enquirerHelper.go(config);
        handleGoResponse(status);
      } else if (!git.hasGit) {
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
    default:
      console.info(getDoc('core'));
      break;
  }
};

function handleGoResponse(status) {
  switch (status) {
    case 1:
      console.error(chalk.red('Failed, specified step does not exist.'));
      break;
    case 2:
      console.warn(chalk.yellow('No patch folder found for this step.'));
      break;
    default:
    case 0:
      console.info(chalk.green('Success.'));
      break;
  }
}
