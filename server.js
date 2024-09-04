const app = require("./app");
const { PORT } = require("./config/config");
const socketHandler = require("./socket/handlers");

module.exports = (app) => {
  // Start server
  const server = app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );

  // Setup WebSocket
  socketHandler(server);
};
