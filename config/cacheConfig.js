const NodeCache = require("node-cache");

// Custom TTL (Time To Live) (giây)
const itemTimeCache = 30;
const categoryTimeCache = 60;
const orderTimeCache = 3;
const userTimeCache = 300;

// Tạo một instance cache với TTL (Time To Live)
const itemCache = new NodeCache({ stdTTL: itemTimeCache });
const categoryCache = new NodeCache({ stdTTL: categoryTimeCache });
const orderCache = new NodeCache({ stdTTL: orderTimeCache });
const userCache = new NodeCache({ stdTTL: userTimeCache });

module.exports = {
  itemCache,
  categoryCache,
  userCache,
  orderCache,
};
