// messaging.js
import createDebugger from 'debug';
import { WebSocketServer } from 'ws';

const debug = createDebugger('express-api:messaging');

const clients = [];

export function createWebSocketServer(httpServer) {
  debug('Creating WebSocket server');
  const wss = new WebSocketServer({
    server: httpServer,
  });

  wss.on('connection', function (ws) {
    debug('New WebSocket client connected');

    clients.push(ws);

    ws.on('message', (message) => {
      let parsedMessage;
      try {
        parsedMessage = JSON.parse(message);
      } catch (err) {
        return debug('Invalid JSON message received from client');
      }

      onMessageReceived(ws, parsedMessage);
    });

    ws.on('close', () => {
      clients.splice(clients.indexOf(ws), 1);
      debug('WebSocket client disconnected');
    });
  });
}

export function broadcastMessage(messageType, data) {
  const structuredMessage = {
    type: messageType,
    data: data,
  };

  debug(
    `Broadcasting message to all connected clients: ${JSON.stringify(
      structuredMessage
    )}`
  );

  clients.forEach((client) => {
    client.send(JSON.stringify(structuredMessage));
  });
}

function onMessageReceived(ws, message) {
  debug(`Received WebSocket message: ${JSON.stringify(message)}`);
  console.log('WebSocket message received:', JSON.stringify(message));
}
