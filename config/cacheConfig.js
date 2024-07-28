const NodeCache = require("node-cache");

// Tạo một instance cache với TTL (Time To Live) mặc định là 10 phút
const itemCache = new NodeCache({ stdTTL: 600 });
const categoryCache = new NodeCache({ stdTTL: 600 });
const orderCache = new NodeCache({ stdTTL: 600 });
const userCache = new NodeCache({ stdTTL: 600 });
const messageCache = new NodeCache({ stdTTL: 600 });

module.exports = {
  itemCache,
  categoryCache,
  userCache,
  orderCache,
  messageCache,
};
