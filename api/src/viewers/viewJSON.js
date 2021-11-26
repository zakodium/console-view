import { sendMessage } from '../sendMessage.js';

export function viewJSON(object) {
  const json = JSON.stringify(object, null, 2);
  sendMessage('JSON', { json });
}
