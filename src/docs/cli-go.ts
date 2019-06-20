import chalk from 'chalk';

export default () =>
`
${chalk.blue('Usage:')}
steps go ${chalk.green('<id>')} ${chalk.yellow('[opts]')}

${chalk.green('[Identifier]:')} Steps identifier, i.e (step-${chalk.green('<id>')})

${chalk.yellow('[Options]:')}
  --help: Prints steps help`
;
