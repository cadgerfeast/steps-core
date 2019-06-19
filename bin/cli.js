#!/usr/bin/env node

// External dependencies
const path = require('path');
const chalk = require('chalk');

// Internal dependencies
const enquirer = require('./helpers/enquirer');
const manager = require('./helpers/manager');
const git = require('./helpers/git');

// Constants
const args = require('minimist')(process.argv.slice(2));
let projectFolder = process.cwd();
if (args.dir) {
  projectFolder = path.resolve(process.cwd(), args.dir);
}

// Configuration
const config = require('./helpers/config')(projectFolder);

// Docs
const coreUsage = require('./docs/core-usage');
const initUsage = require('./docs/init-usage');
const goUsage = require('./docs/go-usage');
const setUsage = require('./docs/set-usage');
const resetUsage = require('./docs/set-usage');

const main = async () => {
  // Commands
  switch (args._[0]) {
    case 'init':
      if (args.help) {
        console.info(initUsage);
      } else {
        const status = await enquirer.init(config);
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
        console.info(resetUsage);
      } else if (!git.hasGit) {
        console.error(chalk.red('Git is not installed on the system, cannot use steps.'));
      } else {
        manager.reset();
      }
      break;
    case 'go':
      if (args.help) {
        console.info(goUsage);
      } else if (typeof args._[1] === 'undefined') {
        const status = await enquirer.go(config);
        handleGoResponse(status);
      } else if (!git.hasGit) {
        console.error(chalk.red('Git is not installed on the system, cannot use steps.'));
      } else {
        const status = manager.go(args._[1], config);
        handleGoResponse(status);
      }
      break;
    case 'set':
      if (args.help || typeof args._[1] === 'undefined') {
        console.info(setUsage);
      } else if (!git.hasGit) {
        console.error(chalk.red('Git is not installed on the system, cannot use steps.'));
      } else {
        manager.set(args._[1], config);
      }
      break;
    default:
      console.info(coreUsage);
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

main();
