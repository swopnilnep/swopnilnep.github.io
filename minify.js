const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const { minify } = require('html-minifier-terser');

const siteDir = './_site';

// Minify CSS
function minifyCSS() {
  const cssPath = path.join(siteDir, 'style.css');
  if (fs.existsSync(cssPath)) {
    const css = fs.readFileSync(cssPath, 'utf8');
    const minified = new CleanCSS().minify(css);
    fs.writeFileSync(cssPath, minified.styles);
    console.log('✓ Minified CSS');
  }
}

// Minify HTML
async function minifyHTML(dir = siteDir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      await minifyHTML(filePath);
    } else if (file.endsWith('.html')) {
      const html = fs.readFileSync(filePath, 'utf8');
      const minified = await minify(html, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true
      });
      fs.writeFileSync(filePath, minified);
    }
  }
}

(async () => {
  minifyCSS();
  await minifyHTML();
  console.log('✓ Minified HTML');
})();
