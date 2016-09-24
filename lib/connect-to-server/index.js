const fetch = require('node-fetch');
const transformContext = require('../utils/transform-context');

// const NeutronFunction = require('./neutron-function');
// const connection = new NeutronServerConnection({
//   url: options.url
// });
//
// return connection(props);

const getRemoteContext = context => {
  return transformContext(context);
};

module.exports = (context) => {
  const connections = context.neutron.getConnectionHosts();
  const requestedFunctions = context.neutron.getRequestedFunctions();

  const remoteContext = getRemoteContext(context);

  const tasks = [];
  const remoteId = `${context.spec.name}@${context.spec.version}`;

  for (const { host } of connections) {
    const masterConnectUrl = `${host}/connect/server`;

    console.log(`push context to ${masterConnectUrl}`);

    const body = {
      remoteId,
      remoteContext,
      requestedFunctions
    };

    const task = fetch(masterConnectUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(response => {
      return response.json();
    }).then(response => {
      // NOTE: do smth here. check errors etc
      console.log('requested functions remote context');
      console.log(response);
    });

    tasks.push(task);
  }

  return Promise.all(tasks);
};
