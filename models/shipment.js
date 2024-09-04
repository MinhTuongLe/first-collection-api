const mongoose = require("mongoose");
const { ShipmentStatus, ShipmentCarrier } = require("../consts/shipment");

const ShipmentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    carrier: {
      type: String,
      enum: Object.values(ShipmentCarrier),
      default: ShipmentCarrier.UPS,
    },
    trackingNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ShipmentStatus),
      default: ShipmentStatus.PENDING,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shipment", ShipmentSchema);
