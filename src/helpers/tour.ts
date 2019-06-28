import chalk from 'chalk';
import cons from 'consolidate';
import express from 'express';
import opener from 'opener';
import * as path from 'path';
import * as fs from 'fs';

import * as componentHelper from './component';

import 'svelte/register';

import Tour from '../components/tour.svelte';

import Markdown from 'markdown-it';
import Prism from 'prismjs';
import emoji from 'node-emoji';

import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

const md: Markdown = new Markdown({
  html: true,
  highlight (str, lang) {
    let hl;
    try {
      hl = Prism.highlight(str, Prism.languages[lang], lang);
    } catch (error) {
      hl = md.utils.escapeHtml(str);
    }
    return `<pre class="language-${lang}"><code class="language-${lang}">${hl}</code></pre>`;
  }
});

// Configuration
import config from '../conf/config';

export async function serve () {
  return new Promise((resolve, reject) => {
    try {
      const app = express();
      app.engine('html', cons.mustache);
      app.set('view engine', 'html');
      app.use('/static', express.static(path.resolve(__dirname, '../static')));
      app.use('/tour', (req, res, next) => {
        res.set('Cache-Control', 'public, max-age=3600');
        const markdownPath = path.resolve(config.projectFolder, req.path.substring(1));
        if (req.path === '/') {
          res.redirect('/tour/README.md');
        } else if (req.path.includes('.md')) {
          let markdown = fs.readFileSync(markdownPath, 'utf8');
          markdown = emoji.emojify(markdown);
          markdown = componentHelper.componentify(markdown, markdownPath);
          const tpl = {
            markdown: md.render(markdown)
          };
          const { html, css, head } = Tour.default.render(tpl);
          res.render(path.resolve(__dirname, '../templates/index.html'), { html, css: css.code, head });
        } else {
          res.sendFile(markdownPath);
        }
      });
      app.listen(config.tour.port, () => {
        const url = `http://localhost:${config.tour.port}/tour`;
        console.info(chalk.green(`\nServing tour on ${chalk.blue(url)}`));
        opener(url);
        resolve(0);
      });
    } catch (error) {
      reject(1);
    }
  });
}
