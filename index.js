const Figma = require('figma-api');

const { personalAccessToken, file, page: targetPage } = require('./config.json');

const { fromPage: generateFromPage } = require('./generator');
const { saveComponents } = require('./file');

// Simple
const start = async () => {
  const api = new Figma.Api({ personalAccessToken });

  const { document } = await api.getFile(file);
  const pages = document.children;
  const page = pages.find(page => page.name === targetPage);

  const components = generateFromPage(page);

  saveComponents(components);
}

start()
