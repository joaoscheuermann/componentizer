const fs = require('fs');
const path = require('path');
const util = require('util');
const rimraf = require('rimraf');

const mkdir = util.promisify(fs.mkdir);
const exists = util.promisify(fs.exists);
const rmrf = util.promisify(rimraf);

const importString = (module, from) => `import ${ module } from '${ from }';\n`;
const lineBreak = () => '\n';

const generateContentFile = async (root, { dependencies, styles, content }) => {
  const file = fs.createWriteStream(path.join(root, 'index.jsx'), { flags: 'a' });

  file.write(importString('React', 'react'))

  // Import Styles
  for (const { name } of styles) {
    file.write(importString(name, `./styles/${ name }`));
  }

  if (styles.length) file.write(lineBreak());

  // Add props to the export
  let toProcess = `export default () => ${ content };`;

  const matchA = /\(\)/;
  const matchB = /(?<!=|\/)>/;
  const matchC = /(?<!=)\/>/;

  toProcess = toProcess.replace(matchA, 'props');
  toProcess = toProcess.replace(matchB, ' {...props}>');
  toProcess = toProcess.replace(matchC, ' {...props}/>');

  // Write the content in the file
  file.write(toProcess);
  file.write(lineBreak());
  file.end();
}

const generateStyleFiles = async (root, { styles }) => {
  const styledComponentsHeader = (tag = 'div') => 'export default styled.div`\n';
  const styledComponentsHeaderDependency = name => 'export default styled(' + name + ')`\n';

  const styledComponentsFooter = () => '`;\n';

  if (!styles.length) return;

  await mkdir(root);

  for (const { name, style, dependency } of styles) {
    await mkdir(path.join(root, name))
    const file = fs.createWriteStream(path.join(root, name, 'index.js'), { flags: 'a' });

    file.write(importString('styled', 'styled-components'));

    if (dependency) {
      file.write(importString(name, `@/components/${name}`));
      file.write(styledComponentsHeaderDependency(name));
    } else {
      file.write(styledComponentsHeader());
    }

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
  if (await exists('./output')) await rmrf('./output');

  await mkdir('./output')

  components.forEach(saveComponentFiles)
};

module.exports = {
  saveComponentFiles,
  fromComponents,
}
