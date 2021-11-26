import { spawn } from 'child_process';
import fs from 'fs';
import http from 'http';
import { fileURLToPath } from 'url';

import got from 'got';

const client = got.extend({
  agent: {
    http: new http.Agent({
      maxSockets: 1,
      keepAlive: true,
    }),
  },
});

const lockFile = new URL('../../server.lock', import.meta.url);
const serverFile = new URL('../../server/src/server.js', import.meta.url);

function getServerUrl() {
  try {
    const port = fs.readFileSync(lockFile, 'ascii');
    if (!port) {
      throw new Error('TODO: wait');
    }
    return `http://localhost:${port}/message`;
  } catch (error) {
    if (error.code === 'ENOENT') {
      const child = spawn(process.execPath, [fileURLToPath(serverFile)], {
        detached: true,
        stdio: 'ignore',
      });
      child.unref();
      // TODO: properly wait
      while (!fs.existsSync(lockFile)) {
        wait(100);
      }
      const port = fs.readFileSync(lockFile, 'ascii');
      return `http://localhost:${port}/message`;
    } else {
      throw error;
    }
  }
}

function wait(ms) {
  const now = Date.now();
  while (Date.now() - now < ms) {
    // Waiting
  }
}

function getCallId() {
  const previousLimit = Error.stackTraceLimit;
  const previousPrepare = Error.prepareStackTrace;

  let callId;

  Error.stackTraceLimit = 4;
  Error.prepareStackTrace = (_, stackFrames) => {
    const stackFrame = stackFrames[stackFrames.length - 1];
    callId = {
      file: normalizeFileName(stackFrame.getFileName()),
      location: `${stackFrame.getLineNumber()}:${stackFrame.getColumnNumber()}`,
    };
  };

  void new Error('').stack;

  Error.stackTraceLimit = previousLimit;
  Error.prepareStackTrace = previousPrepare;

  return callId;
}

export function sendMessage(kind, payload) {
  const callId = getCallId();
  const serverUrl = getServerUrl();
  client.post(serverUrl, {
    json: {
      id: {
        ...callId,
        pid: process.pid,
      },
      data: {
        kind,
        ...payload,
      },
    },
    responseType: 'json',
  });
}

function normalizeFileName(name) {
  if (/^REPL\d+/.test(name)) {
    return 'REPL';
  } else {
    return name;
  }
}
