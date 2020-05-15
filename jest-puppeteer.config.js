const headless = process.env.HEADLESS === '1' ? true : false;

module.exports = {
  launch: {
    dumpio: true,
    headless,
    //devtools: !headless
    //slowMo: headless ? 0 : 25,
  },
  server: {
    command: 'node tests/server.js',
    port: process.env.PORT || 4444,
  },
  browser: 'chromium',
  browserContext: 'default',
};
