import fs from 'fs';
import http from 'http';

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

function getServerUrl() {
  const port = fs.readFileSync(lockFile, 'ascii');
  if (!port) {
    throw new Error('TODO: start server');
  }
  return `http://localhost:${port}/message`;
}

function getCallId() {
  const previousLimit = Error.stackTraceLimit;
  const previousPrepare = Error.prepareStackTrace;

  let callId;

  Error.stackTraceLimit = 4;
  Error.prepareStackTrace = (_, stackFrames) => {
    const stackFrame = stackFrames[stackFrames.length - 1];
    callId = {
      file: stackFrame.getFileName(),
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
