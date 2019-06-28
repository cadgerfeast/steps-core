import chalk from 'chalk';

export default () =>
`
${chalk.blue('Usage:')}
steps ${chalk.green('<cmd>')} ${chalk.yellow('[opts]')}

${chalk.green('<Commands>:')}
  init ${chalk.yellow('[ops]')}: Initializes a project
  go ${chalk.green('<id>')} ${chalk.yellow('[ops]')}: Goes to step-<id>
  reset ${chalk.yellow('[ops]')}: Resets current progression
  set ${chalk.green('<id>')} ${chalk.yellow('[ops]')}: Sets patch for step-<id>
  serve ${chalk.yellow('[ops]')}: Serves the tour

${chalk.yellow('[Options]:')}
  --help: Prints steps help
  --dir: Specify project directory`
;
