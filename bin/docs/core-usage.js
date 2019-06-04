const chalk = require('chalk');

module.exports = `
${chalk.blue('Usage:')}
steps ${chalk.green('<cmd>')} ${chalk.yellow('[opts]')}

${chalk.green('<Commands>:')}
  init ${chalk.yellow('[ops]')}: Initializes a project
  go ${chalk.yellow('[ops]')}: Goes to specific step

${chalk.yellow('[Options]:')}
  --help: Prints steps help
  --dir: Specify project directory`;
