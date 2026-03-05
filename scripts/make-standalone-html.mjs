import { promises as fs } from 'node:fs';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist');
const indexPath = path.join(distDir, 'index.html');
const standalonePath = path.join(distDir, 'standalone.html');

const html = await fs.readFile(indexPath, 'utf8');

const scriptTagRegex = /<script[^>]*src="([^"]+)"[^>]*><\/script>/i;
const styleTagRegex = /<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/i;

const scriptMatch = html.match(scriptTagRegex);
const styleMatch = html.match(styleTagRegex);

if (!scriptMatch || !styleMatch) {
  throw new Error('Could not find script or stylesheet tag in dist/index.html');
}

const scriptSrc = scriptMatch[1];
const styleHref = styleMatch[1];

const jsPath = path.resolve(distDir, scriptSrc.replace(/^\.\//, ''));
const cssPath = path.resolve(distDir, styleHref.replace(/^\.\//, ''));

const [js, css] = await Promise.all([
  fs.readFile(jsPath, 'utf8'),
  fs.readFile(cssPath, 'utf8'),
]);

const escapedJs = js.replace(/<\/script/gi, '<\\/script');

let standaloneHtml = html
  .replace(styleTagRegex, () => `<style>\n${css}\n</style>`)
  .replace(scriptTagRegex, '');

standaloneHtml = standaloneHtml.replace(
  /<\/body>/i,
  () => `  <script>\n${escapedJs}\n</script>\n  </body>`
);

await fs.writeFile(standalonePath, standaloneHtml, 'utf8');
console.log(`Generated ${path.relative(process.cwd(), standalonePath)}`);
