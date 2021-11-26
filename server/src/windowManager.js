import { randomUUID } from 'crypto';

import open from 'open';

let activeConnections = 0;
const connections = new Map();

const messageQueue = new Map();

// Mapping of filename to window UUID.
const fileToId = new Map();

export function sendMessage(message) {
  const file = message.id.file;
  let id = fileToId.get(file);
  if (!id) {
    // No window created for this file yet.
    id = randomUUID();
    fileToId.set(file, id);
  }
  enqueueMessage(id, message.data);
}

function enqueueMessage(id, data) {
  let queue = messageQueue.get(id);
  if (!queue) {
    queue = [];
    messageQueue.set(id, queue);
  }
  queue.push(data);
  drainQueue(id);
}

function drainQueue(id) {
  const connection = connections.get(id);
  if (connection === 'CONNECTING') {
    return;
  } else if (connection) {
    const queue = messageQueue.get(id);
    let data;
    while ((data = queue.shift())) {
      connection.socket.send(JSON.stringify({ type: 'ADD', payload: data }));
    }
  } else {
    openWindow(id);
  }
}

function openWindow(id) {
  connections.set(id, 'CONNECTING');
  open(`http://localhost:3333#windowId=${id}`);
}

export function addConnection(windowId, connection) {
  activeConnections++;
  connections.set(windowId, connection);
  drainQueue(windowId);
}

export function closeConnection(connectionId) {
  activeConnections--;
  if (activeConnections === 0) {
    process.kill(process.pid);
  }
  connections.delete(connectionId);
}
