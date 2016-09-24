const route = require('koa-route');

const transformContext = require('./utils/transform-context');

const execute = (neutronFunction, props, scope) => {
  try {
    return neutronFunction.execute(props, scope);
  } catch (e) {
    return {
      error: true,
      message: e.message
    };
  }
};

module.exports = (app, context) => {
  app.use(route.get('/connect/client', function* (next) {
    this.body = transformContext(context.schema);

    yield next;
  }));

  app.use(route.get('/connect/execute', function* (next) {
    const params = {};

    const funcName = this.request.query.funcName;
    const props = JSON.parse(this.request.query.props || '');

    const neutronFunction = context.schema.functions.get(funcName);
    const protocols = neutronFunction.getProtocols();

    if (!protocols.http || protocols.method != 'GET') {
      this.body = 'denied';
    } else {
      const scope = context.schema.getScope();

      yield execute(neutronFunction, props, scope).then(functionResponse => {
        this.body = functionResponse;
      });
    }

    yield next;
  }));

  app.use(route.post('/connect/execute', function* (next) {
    const params = {};
    const funcName = 'barA';

    const neutronFunction = context.functions.get(funcName);
    const protocols = neutronFunction.getProtocols();

    if (!protocols.http || protocols.method != 'POST') {
      this.body = 'denied';
    } else {
      const scope = context.schema.getScope();
      this.body = execute(neutronFunction, props, scope);
    }

    yield next;
  }));
};
