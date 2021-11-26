import { viewJSON } from './viewers/viewJSON.js';

export function patchConsole() {
  console.viewJSON = viewJSON;
}
