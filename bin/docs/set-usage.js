const chalk = require('chalk');

module.exports = `
${chalk.blue('Usage:')}
steps set ${chalk.green('<id>')} ${chalk.yellow('[opts]')}

${chalk.green('[Identifier]:')} Steps identifier, i.e (step-${chalk.green('<id>')})

${chalk.yellow('[Options]:')}
  --help: Prints steps help`;
