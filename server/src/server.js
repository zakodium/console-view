import { randomUUID } from 'crypto';

import fastify from 'fastify';
import fastifyWs from 'fastify-websocket';

const imgSrc =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';

const server = fastify({ logger: true });

server.register(fastifyWs);

server.get('/', () => {
  return { hello: 'world' };
});

server.get('/ws', { websocket: true }, (connection) => {
  function dispatch(action) {
    connection.socket.send(JSON.stringify(action));
  }

  const i1 = setInterval(() => {
    dispatch({
      type: 'ADD',
      payload: { id: randomUUID(), kind: 'IMAGE', src: imgSrc },
    });
  }, 1000);
  const i2 = setInterval(() => {
    dispatch({ type: 'RESET' });
  }, 15000);

  connection.socket.on('close', () => {
    clearInterval(i1);
    clearInterval(i2);
  });
});

await server.listen(3333);
