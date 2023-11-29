
import WebSocket from 'websocket';

const client = new WebSocket.w3cwebsocket('ws://localhost:3000');
client.onerror = function () {
  console.log('Connection Error');
};

client.onopen = function () {
  console.log('WebSocket Client Connected');
  sendMessage('Hello, Server!');
};

client.onclose = function () {
  console.log('WebSocket Client Closed');
};

client.onmessage = function (e) {
  if (typeof e.data === 'string') {
    console.log("Received: '" + e.data + "'");
  }
};

function sendMessage(message) {
  if (client.readyState === client.OPEN) {
    client.send(JSON.stringify({ type: 'message', data: message }));
  }
}
