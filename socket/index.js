const socket = require("socket.io");

const socketHandler = (server) => {
  const io = socket(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-receive", data.msg);
      }
    });
  });

  return { io, onlineUsers };
};

module.exports = socketHandler;
