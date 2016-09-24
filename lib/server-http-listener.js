const route = require('koa-route');

const pendingLinks = [];
const connectedServers = new Map();

module.exports = (app, context) => {
  app.use(route.post('/connect/server', function* (next) {
    const { remoteContext, remoteId, requestedFunctions } = this.request.body;
    const { functions } = remoteContext;

    if (connectedServers.has(remoteId)) {
      console.log(`reconnect: ${remoteId}`);
    } else {
      connectedServers.set(remoteId, {
        remoteContext
      });

      console.log(`connect from: ${remoteId}`);
    }

    // NOTE: update neutron runtime

    for (const funcName of Object.keys(functions)) {
      const func = functions[funcName];

      console.log(`- ${funcName}@${remoteId}`);

      // NOTE: write code for reconnected remotes
      // if (isReconnect) {
      //   context.schema.replaceRemoteFunction(funcName, {
      // }

      context.schema.addRemoteFunction(funcName, {
        remoteId: remoteId,
        protocols: func.protocols
      });
    }

    const linkedContext = {};
    const { schema } = context;

    console.log(`requested links ${requestedFunctions}`);

    for (const funcName of requestedFunctions) {
      if (schema.functions.has(funcName)) {
        // NOTE: remove hardcode
        linkedContext[funcName] = context.schema.meta.get(`function.${funcName}`);
      } else {

        console.log(`save pending link ${funcName} for ${remoteId}`);

        pendingLinks.push({
          funcName,
          remoteId
        });
      }
    }

    this.body = linkedContext;
  }));
};
