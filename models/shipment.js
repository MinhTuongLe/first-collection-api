const mongoose = require("mongoose");

const ShipmentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    carrier: {
      type: String,
      required: true,
    },
    trackingNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shipment", ShipmentSchema);
