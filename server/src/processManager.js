import fs from 'fs';

const lockFile = new URL('../../server.lock', import.meta.url);

function createLock() {
  fs.writeFileSync(lockFile, '');
}

function removeLock() {
  fs.unlinkSync(lockFile);
}

function exit() {
  process.exit(0);
}

export function start() {
  createLock();
  process.on('exit', removeLock);
  process.on('SIGINT', exit);
  process.on('SIGTERM', exit);
}

export function setPort(port) {
  fs.writeFileSync(lockFile, String(port));
}
