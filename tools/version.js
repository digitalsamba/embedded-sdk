const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

try {
  const filePath = path.resolve(__dirname, '../src/utils/vars.ts');
  const version = packageJson.version;
  if (version) {
    const content = fs.readFileSync(filePath, 'utf8');
    const pattern = /(PACKAGE_VERSION\s*=\s*)(['"])[^'"]*\2/;

    if (!pattern.test(content)) {
      throw new Error(`PACKAGE_VERSION declaration not found in ${filePath}`);
    }

    fs.writeFileSync(filePath, content.replace(pattern, `$1$2${version}$2`), 'utf8');
  }
} catch (e) {
  console.error('Could not update package version token.');
  console.error(e);
  process.exitCode = 1;
}
