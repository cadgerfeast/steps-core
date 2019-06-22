import * as path from 'path';
import * as fs from 'fs';
import minimist from 'minimist';

export interface UserConfig {
  [key: string]: string;
}

class Configuration {
  // Attributes
  public srcFolder: string;
  public patchFolder: string;
  public projectFolder: string;
  public ignore: string[];
  // Constructor
  constructor () {
    const args = minimist(process.argv.slice(2));
    let projectFolder = process.cwd();
    if (args.dir) {
      projectFolder = path.resolve(process.cwd(), args.dir);
    }
    // Initialization
    this.srcFolder = './';
    this.patchFolder = 'patch';
    this.projectFolder = projectFolder;
    this.ignore = [];
    this.readUserConfiguration(projectFolder);
    this.srcFolder = path.resolve(projectFolder, this.srcFolder);
  }
  // Methods
  private readUserConfiguration (projectFolder: string) {
    const userConfigPath = path.resolve(projectFolder, 'steps.config.json');
    if (fs.existsSync(userConfigPath)) {
      const userConfig: UserConfig = require(userConfigPath);
      for (const key in userConfig) {
        if (userConfig.hasOwnProperty(key)) {
          // TODO fix: no any type
          (this as any)[key] = userConfig[key];
        }
      }
    }
  }
}

export default new Configuration();
