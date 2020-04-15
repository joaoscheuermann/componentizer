const fs = require('fs');
const path = require('path');
const util = require('util');
const rimraf = require('rimraf');

const mkdir = util.promisify(fs.mkdir);
const exists = util.promisify(fs.exists);
const rmrf = util.promisify(rimraf);

const generateContentFile = async (root, { dependencies, styles, content }) => {
  const importString = (pathToImportFrom, name) => `import ${ name } from '${ pathToImportFrom }${ name }';\n`;
  const lineBreak = () => '\n';

  const file = fs.createWriteStream(path.join(root, 'index.jsx'), { flags: 'a' });

  // Import Dependencies
  for (const dependency of dependencies) {
    file.write(importString('@/components/', dependency));
  }

  if (dependencies.length) file.write(lineBreak());

  // Import Styles
  for (const { name } of styles) {
    file.write(importString('./styles/', name));
  }

  if (styles.length) file.write(lineBreak());

  // Write the content in the file
  file.write(`export default () => ${ content }`);

  file.write(lineBreak());

  file.end();
}

const generateStyleFiles = async (root, { styles }) => {
  const importString = (module, from) => `import ${ module } from '${ from }';\n`;
  const styledComponentsHeader = (tag = 'div') => 'export default styled.div`\n';
  const styledComponentsFooter = () => '`;\n';

  if (!styles.length) return;

  await mkdir(root);

  for (const { name, style } of styles) {
    await mkdir(path.join(root, name))
    const file = fs.createWriteStream(path.join(root, name, 'index.js'), { flags: 'a' });

    file.write(importString('styled', 'styled-components'));
    file.write(styledComponentsHeader());

    for (const [key, value] of Object.entries(style))
      file.write(`  ${key}: ${value};\n`);

    file.write(styledComponentsFooter());
    file.end();
  }

  return
}

const saveComponentFiles = async ({ name, ...props }) => {
  const root = path.join('./','output', name);
  const stylesRoot = path.join(root, 'styles');

  await mkdir(root);

  await generateContentFile(root, { ...props });
  await generateStyleFiles(stylesRoot, { ...props });

  console.log(`Generated ${ name } component files`);
}

const fromComponents = async components => {
  if (await exists('./output'))
    await rmrf('./output');

  await mkdir('./output')

  components.forEach(saveComponentFiles)
};

module.exports = {
  saveComponentFiles,
  fromComponents,
}
