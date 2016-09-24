const transformContext = require('./utils/transform-context');
const ResponseError = require('./utils/response-error');

const EXECUTE_FUNCTION_EVENT = 'executeFunction';

module.exports = (io, context) => {
  io.on('connection', socket => {
    socket.on('disconnect', function () {
      console.log(`disconnect ${socket.id}`);
    });

    socket.on('initialize', () => {
      console.log('initialize');

      socket.emit('initialize done', transformContext(context.schema));
    });

    socket.on(EXECUTE_FUNCTION_EVENT, ({ funcName, props, uid }) => {
      let result = {};

      try {
        const neutronFunction = context.functions.get(funcName);
        result = neutronFunction.execute(props);
      } catch (e) {
        result = {
          error: true,
          message: e.message
        };
      }

      Promise.resolve(result).then(response => {
        socket.emit(`${EXECUTE_FUNCTION_EVENT} done ${uid}`, {
          response
        });
      });
    });
  });
}
