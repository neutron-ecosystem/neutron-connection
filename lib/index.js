const serverHttpListener = require('./server-http-listener');
const serverSocketListener = require('./server-http-listener');

const clientSocketListener = require('./client-http-listener');
const clientHttpListener = require('./client-socket-listener');

const connectToServer = require('./connect-to-server');
const Connection = require('./utils/connection');

module.exports = {
  Connection,
  serverListeners(app, context) {
    serverHttpListener(app, context);
    serverSocketListener(app, context);
  },

  clientListeners(app, context) {
    clientHttpListener(app, context);
    clientSocketListener(app, context);
  },

  connectToServer(context) {
    return connectToServer(context);
  }
}
