const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    orderId: { type: String, required: true },
    paymentId: { type: String, required: true },
    amount: { type: Number, required: true },
    cart: { type: Array, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
