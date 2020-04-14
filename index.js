const Figma = require('figma-api');

const { personalAccessToken, file, page: targetPage } = require('./config.json');
const { fromPage: generateFromPage } = require('./generator');



const generateFiles = components => {
  if (fs.existsSync('./tmp')) rimraf.sync('./tmp')

  fs.mkdirSync('./tmp');

  for (const component of components) {
    fs.mkdirSync(`./tmp/${ component.name }`);
    fs.mkdirSync(`./tmp/${ component.name }/styles`);
    
    for (const { name, style } of component.styles) {
      // Creates the folder;
      fs.mkdirSync(`./tmp/${ component.name }/styles/${ name }`);

      const file = fs.createWriteStream(`./tmp/${ component.name }/styles/${ name }/index.js`, { flags: 'a' });

      file.write(`import styled from 'styled-components';\n\n`);
      file.write('export default styled.div`\n');

      for (const key in style) {
        file.write(`  ${ key }: ${style[key]};\n`);
      }

      file.write('`;');

      file.end();
    }

    fs.writeFileSync(`./tmp/${ component.name }/index.jsx`, `export default () => ${ component.content }`);
  }
}

// Simple
const start = async () => {
  const api = new Figma.Api({ personalAccessToken });

  const { document } = await api.getFile(file);
  const pages = document.children;
  const page = pages.find(page => page.name === targetPage);

  const components = generateFromPage(page);

  console.log(components)
  // generateFiles(components);
}

start()
