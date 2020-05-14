// @ts-nocheck
const path = require('path');
const Polonez = require('polonez');
const ServeStatic = require('serve-static');

let polonez = Polonez();
polonez.use(ServeStatic(path.resolve('./')));

let port = 4444;
if (process.argv.length > 2) {
  port = Number(process.argv[2]);
}
if (process.env.PORT) {
  port = Number(process.env.PORT);
}
polonez.listen(port);
console.log(`Visit: http://localhost:${port}/tests/index.html`); // eslint-disable-line no-console
