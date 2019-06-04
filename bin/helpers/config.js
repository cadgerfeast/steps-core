const path = require('path');
const fs = require('fs');

class Configuration {
  constructor (projectFolder) {
    // Attributes
    this.srcFolder = './';
    this.patchFolder = 'patch';
    // User Config
    const userConfigPath = path.resolve(projectFolder, 'steps.config.json');
    if (fs.existsSync(userConfigPath)) {
      const userConfig = require(userConfigPath);
      for (const key in userConfig) {
        if (userConfig.hasOwnProperty(key)) {
          this[key] = userConfig[key];
        }
      }
    }
    // Paths
    this.srcFolder = path.resolve(projectFolder, this.srcFolder);
    this.projectFolder = projectFolder;
  }
}

module.exports = (projectFolder) => new Configuration(projectFolder);
