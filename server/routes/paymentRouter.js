const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const router = express.Router();

const auth = require("../middleware/auth");
const prisma = require("../config/prisma");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
router.post("/create-order", auth, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ msg: "Invalid amount" });
    }

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      error: "Failed to create order",
    });
  }
});

// Verify Payment & Save Order
router.post("/verify", auth, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cart,
      total,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        msg: "Invalid payment signature",
      });
    }

    const newOrder = await prisma.order.create({
      data: {
        userId: req.user.id,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amount: Number(total),
        cart,
      },
    });

    res.json({
      msg: "Payment verified & order placed",
      order: newOrder,
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    res.status(500).json({
      msg: error.message,
    });
  }
});

module.exports = router;
