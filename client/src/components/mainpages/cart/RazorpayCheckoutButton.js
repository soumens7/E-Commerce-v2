import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const RazorpayCheckoutButton = ({ cart }) => {
  const amount = cart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );
  const token = localStorage.getItem("access_token"); // or via context
  //console.log("🔐 Access Token (Frontend):", token);
  const handleCheckout = async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded) return alert("Razorpay SDK failed to load.");

    const { data: order } = await axios.post(
      `${API_URL}/api/payment/create-order`,
      { amount },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      order_id: order.id,
      name: "MERN Shop",
      description: "Order Payment",
      handler: async function (response) {
        try {
          await axios.post(
            `${API_URL}/api/payment/verify`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              cart,
              total: amount,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          alert("✅ Payment successful!");
          window.location.href = "/";
        } catch (error) {
          alert("❌ Payment verification failed");
        }
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button onClick={handleCheckout} className="razorpay-btn">
      {/* Pay ₹{amount.toFixed(2)} */}
      Pay Now
    </button>
  );
};

export default RazorpayCheckoutButton;
