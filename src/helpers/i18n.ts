import * as path from 'path';
import * as fs from 'fs';

const i18nPath = path.resolve(__dirname, '../i18n');

export default function i18n (lang: string): {[key: string]: string} {
  let strings = JSON.parse(fs.readFileSync(path.resolve(i18nPath, 'en-gb/strings.json'), 'utf8'));
  const langPath = path.resolve(i18nPath, `${lang}/strings.json`);
  if (fs.existsSync(langPath)) {
    const newStrings = JSON.parse(fs.readFileSync(langPath, 'utf8'));
    strings = {...strings, ...newStrings};
  }
  return strings;
}
