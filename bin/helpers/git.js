const childProcess = require('child_process');
const path = require('path');
const fs = require('fs-extra');

class GitHelper {
  static get hasGit () {
    try {
      childProcess.execSync('git version').toString();
      return true;
    } catch (error) {
      return false;
    }
  }
  static go (patchFolder, config) {
    this.reset();
    fs.copySync(patchFolder, config.projectFolder);
  }
  static set (patchName, patchFolder, config) {
    childProcess.execSync('git add --all');
    let relativeFolder = path.relative(process.cwd(), config.srcFolder);
    relativeFolder = relativeFolder.trim() ? `${relativeFolder}` : '';
    const files = childProcess.execSync(`git diff --cached --name-only ${relativeFolder}`).toString().split('\n');
    for (let i = 0; i < files.length; i++) {
      if (files[i]) {
        const src = path.resolve(process.cwd(), files[i]);
        if (config.ignore && this.isIgnored(src, config.ignore)) {
          continue;
        }
        const dest = path.resolve(patchFolder, files[i]);
        fs.removeSync(dest);
        fs.copySync(src, dest);
      }
    }
  }
  static isIgnored (src, ignore) {
    for (let i = 0; i < ignore.length; i++) {
      if (src.indexOf(path.resolve(process.cwd(), ignore[i])) === 0) {
        return true;
      }
    }
    return false;
  }
  static reset () {
    childProcess.execSync('git add --all');
    childProcess.execSync('git reset --hard');
  }
}

module.exports = GitHelper;
