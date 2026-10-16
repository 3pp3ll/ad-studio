/* Bundles index.html + css + js into one self-contained file: dist/adhelper.html */
const fs = require('fs'), path = require('path');
const root = __dirname, read = f => fs.readFileSync(path.join(root, f), 'utf8');
let html = read('index.html');
html = html.replace(/<link rel="stylesheet" href="(css\/[^"]+)">/g, (m, f) => `<style>\n${read(f)}\n</style>`);
html = html.replace(/<script src="(js\/[^"]+)"><\/script>\n?/g, (m, f) => `<script>\n${read(f).replace(/<\/script/gi, '<\\/script')}\n</script>\n`);
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', 'adhelper.html'), html);
console.log('dist/adhelper.html', (html.length / 1024).toFixed(0) + ' KB');
