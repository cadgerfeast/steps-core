import * as path from 'path';
import * as fs from 'fs-extra';
import { execSync } from 'child_process';

// Configuration
import config from '../conf/config';

export default class GitHelper {
  public static get hasGit () {
    try {
      execSync('git version').toString();
      return true;
    } catch (error) {
      return false;
    }
  }
  public static go (patchFolder: string) {
    this.reset();
    fs.copySync(patchFolder, config.projectFolder);
  }
  public static set (patchFolder: string) {
    fs.removeSync(patchFolder);
    execSync('git add --all');
    let relativeFolder = path.relative(process.cwd(), config.srcFolder);
    relativeFolder = relativeFolder.trim() ? `${relativeFolder}` : '';
    const files = execSync(`git diff --cached --name-only ${relativeFolder}`).toString().split('\n');
    for (let i = 0; i < files.length; i++) {
      if (files[i]) {
        const src = path.resolve(process.cwd(), files[i]);
        if (config.ignore && this.isIgnored(src, config.ignore)) {
          continue;
        }
        const dest = path.resolve(patchFolder, files[i]);
        fs.copySync(src, dest);
      }
    }
  }
  public static reset () {
    execSync('git add --all');
    execSync('git reset --hard');
  }
  private static isIgnored (src: string, ignore: string[]) {
    for (let i = 0; i < ignore.length; i++) {
      if (src.indexOf(path.resolve(process.cwd(), ignore[i])) === 0) {
        return true;
      }
    }
    return false;
  }
}
