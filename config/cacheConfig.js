const NodeCache = require("node-cache");

// Custom TTL (Time To Live) (giây)
const itemTimeCache = 0; // Cache items for 1 minute
const categoryTimeCache = 0; // Cache categories for 5 minutes
const orderTimeCache = 0; // Cache orders for 2 minutes
const userTimeCache = 0; // Cache users for 10 minutes

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
