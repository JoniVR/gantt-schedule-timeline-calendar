module.exports = {
  launch: {
    dumpio: true,
    headless: true,
  },
  server: {
    command: 'node tests/server.js',
    port: 4444,
  },
  browser: 'chromium',
  browserContext: 'default',
};
