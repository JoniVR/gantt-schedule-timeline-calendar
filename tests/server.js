// @ts-nocheck
const path = require('path');
const Polonez = require('polonez');
const ServeStatic = require('serve-static');

let polonez = Polonez();
polonez.use(ServeStatic(path.resolve('./')));
polonez.listen(4444);
console.log('Visit: http://localhost:4444/tests/index.html');
