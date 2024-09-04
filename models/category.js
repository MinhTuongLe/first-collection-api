const mongoose = require("mongoose");
const { Statuses } = require("../consts/status");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      enum: Object.values(Statuses),
      default: Statuses.ACTIVE,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
