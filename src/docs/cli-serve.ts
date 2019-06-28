import chalk from 'chalk';

export default () =>
`
${chalk.blue('Usage:')}
steps serve ${chalk.yellow('[opts]')}

${chalk.yellow('[Options]:')}
  --help: Prints steps help`
;
