const Message = require("../models/message");

exports.getMessages = async (from, to) => {
  const messages = await Message.find({
    users: {
      $all: [from, to],
    },
  }).sort({ updatedAt: 1 });

  return messages.map((msg) => {
    return {
      fromSelf: msg.sender.toString() === from,
      message: msg.message.text,
    };
  });
};

exports.addMessage = async (from, to, message) => {
  const data = await Message.create({
    message: { text: message },
    users: [from, to],
    sender: from,
  });

  if (data) return { msg: "Message added successfully." };
  else return { msg: "Failed to add message to the database" };
};
