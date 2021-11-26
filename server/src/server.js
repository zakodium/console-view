import Fastify from 'fastify';
import fastifyWs from 'fastify-websocket';

import * as processManager from './processManager.js';
import * as windowManager from './windowManager.js';

processManager.start();

const fastify = Fastify({ logger: true });

fastify.register(fastifyWs);

fastify.post('/message', (request) => {
  windowManager.sendMessage(request.body);
  return { ok: true };
});

fastify.get('/ws', { websocket: true }, (connection, request) => {
  const { windowId } = request.query;
  windowManager.addConnection(windowId, connection);
  connection.socket.on('close', () => {
    windowManager.closeConnection(windowId);
  });
});

// TODO: change to 0.
await fastify.listen(3333);

processManager.setPort(fastify.server.address().port);
