const messageService = require("../../services/messageService");

exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await messageService.getMessages(from, to);
    res.json(messages);
  } catch (ex) {
    next(ex);
  }
};

exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const response = await messageService.addMessage(from, to, message);
    res.json(response);
  } catch (ex) {
    next(ex);
  }
};
