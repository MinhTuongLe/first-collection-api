module.exports = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    // Handle socket events here

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};
