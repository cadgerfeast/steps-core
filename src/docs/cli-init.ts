import chalk from 'chalk';

export default () =>
`
${chalk.blue('Usage:')}
steps init ${chalk.yellow('[opts]')}

${chalk.yellow('[Options]:')}
  --help: Prints steps help
  --dir: Specify project directory`
;
