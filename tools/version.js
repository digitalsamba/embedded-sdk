const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

try {
  const filePath = path.resolve(__dirname, '../src/utils/vars.ts');
  const placeholder = '__PACKAGE_VERSION__';
  const version = packageJson.version;
  if (version) {
    let content = fs.readFileSync(filePath, 'utf8');

    content = content.replace(new RegExp(placeholder, 'g'), version);

    fs.writeFileSync(filePath, content, 'utf8');
  }
} catch (e) {
  console.error('Could not update package version token.');
  console.error(e);
}
