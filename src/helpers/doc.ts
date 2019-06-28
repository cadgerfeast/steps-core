import cliCore from '../docs/cli-core';
import cliGo from '../docs/cli-go';
import cliInit from '../docs/cli-init';
import cliReset from '../docs/cli-reset';
import cliServe from '../docs/cli-serve';
import cliSet from '../docs/cli-set';

export function getDoc (cmd: string) {
  switch (cmd) {
    case 'core':
      return cliCore();
    case 'go':
      return cliGo();
    case 'init':
      return cliInit();
    case 'reset':
      return cliReset();
    case 'set':
      return cliSet();
    case 'serve':
        return cliServe();
    default:
    case 'core':
      return cliCore();
  }
}
