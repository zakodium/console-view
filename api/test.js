import { patchConsole } from './src/patchConsole.js';

patchConsole();

console.viewJSON({ a: 1 });
console.viewJSON({ b: 1 });
console.viewJSON({ c: 1 });
