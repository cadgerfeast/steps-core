import * as path from 'path';
import * as fs from 'fs';

export function componentify (markdown: string, markdownPath: string): string {
  const finalLines = [];
  const lines = markdown.split('\n');
  for (const line of lines) {
    let newLine = line;
    if (line.startsWith('[//]: # (')) {
      try {
        const url = line.replace('[//]: # (', '').slice(0, -1);
        const template = fs.readFileSync(path.resolve(markdownPath, `../${url}`), 'utf8');
        newLine = `${template}<br/>`;
      } catch (error) {
        console.error(error);
      }
    }
    finalLines.push(newLine);
  }
  return finalLines.join('\n');
}
