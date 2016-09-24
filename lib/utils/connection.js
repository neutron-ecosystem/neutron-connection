const fetch = require('node-fetch');
const transformContext = require('./transform-context');

const HEADERS = {
  'Content-Type': 'application/json'
};

const getConnectionUrl = host => {
  return `${host}/connect/server`;
};

module.exports = class Connection {
  constructor(id, {
    requestedFunctions,
    schema,
    host,
    protocols
  }) {
    this.connectionId = null;

    this.id = id;
    this.host = host;

    this.schema = schema;
    this.protocols = protocols;
    this.requestedFunctions = requestedFunctions;

    this.connectUrl = getConnectionUrl(this.host);
  }

  connect() {
    console.log(`push context to ${masterConnectUrl}`);

    const context = transformContext(this.schema);
    const body = {
      id: this.id,
      context,
      requestedFunctions: this.requestedFunctions
    };

    return fetch(this.connectUrl, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(body)
    }).then(response => {
      return response.json();
    }).then(response => {
      this.connectionId = response.connectionId;
      // TODO:
      console.log(response);
    });
  }

  disconnect() {
    if (!this.connectionId) {
      throw new Error('is not connected');
    };

    const body = {
      id: this.id,
      connectionId: this.connectionId
    };

    return fetch(this.disconnectUrl, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(body)
    }).then(response => {
      return response.json();
    }).then(response => {
      // TODO:
    });
  }
};
