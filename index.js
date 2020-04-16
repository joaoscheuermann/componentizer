const Figma = require('figma-api');

const { personalAccessToken, file, page: targetPage } = require('./config.json');

const { components, files } = require('./generator');

// Simple
const start = async () => {
  const api = new Figma.Api({ personalAccessToken });

  const { document } = await api.getFile(file);
  const pages = document.children;
  const page = pages.find(page => page.name === targetPage);

  files.fromComponents(await components.fromPage(page));
}

start();
