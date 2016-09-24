const makeId = () => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

module.exports = schema => {
  const functions = {};

  for (const [funcName, neutronFunction] of schema.functions) {
    const func = {
      protocols: neutronFunction.getProtocols(),
      isDirectCallAvailable: neutronFunction.isDirectCallAvailable()
    };

    if (neutronFunction.isDirectCallAvailable()) {
      Object.assign(func, {
        url: neutronFunction.getRemoteAddress()
      });
    }

    functions[funcName] = func;
  }

  return {
    connection: makeId(),
    functions,
    protocols: {
      http: true,
      socket: false
    }
  };
};
