module.exports = {
  mode: 'production',
  target: 'node',
  entry: './server.js',
  output: {
    path: __dirname,
    filename: 'websocket_server.js',
  },
};