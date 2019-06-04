const path = require('path');
const fs = require('fs');

module.exports = {
  copyFolderSync (src, dist, include) {
    let files = [];
    const targetFolder = include ? path.join(dist, path.basename(src)) : dist;
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder);
    }
    if (fs.lstatSync(src).isDirectory()) {
      files = fs.readdirSync(src);
      files.forEach((file) => {
        const curSource = path.join(src, file);
        if (fs.lstatSync(curSource).isDirectory()) {
          this.copyFolderSync(curSource, targetFolder);
        } else {
          this.copyFileSync(curSource, targetFolder);
        }
      });
    }
  },
  copyFileSync: (src, dist) => {
    let targetFile = dist;
    if (fs.existsSync(dist)) {
      if (fs.lstatSync(dist).isDirectory()) {
        targetFile = path.join(dist, path.basename(src));
      }
    }
    fs.writeFileSync(targetFile, fs.readFileSync(src));
  }
};
