const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be a positive number"],
    },
    status: {
      type: Number,
      enum: Object.values(Statuses),
      default: Statuses.ACTIVE,
    },
  },
  { timestamps: true }
);

// Define a virtual field for `category`
ItemSchema.virtual("category", {
  ref: "Category", // The model to use
  localField: "categoryId", // The field in the order model
  foreignField: "_id", // The field in the category model
  justOne: true, // For one-to-one relationship
});

// Apply the virtual fields when converting the document to JSON
ItemSchema.set("toObject", { virtuals: true });
ItemSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Item", ItemSchema);
