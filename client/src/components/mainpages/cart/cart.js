import React, { useContext } from "react";
import { GlobalState } from "../../../GlobalState";
import { MdDelete } from "react-icons/md";
import "./cart.css";
import RazorpayCheckoutButton from "./RazorpayCheckoutButton";
function Cart() {
  const state = useContext(GlobalState);
  const [cart] = state.userAPI.cart;
  const total = cart.reduce((acc, item) => {
    const quantity = item.quantity || 1;
    return acc + quantity * item.price;
  }, 0);
  const itemCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const removeFromCart = state.userAPI.removeFromCart;
  const updateCartQuantity = state.userAPI.updateCartQuantity;

  console.log("Rendering cart component with cart:", cart);

  if (cart.length === 0) {
    return <h2 className="empty-cart">Cart Empty</h2>;
  }

  return (
    <div className="cart-grid">
      {/* LEFT: Cart Items */}
      <div className="cart-left">
        <h2 className="cart-title">Your Shopping Cart</h2>
        <div className="cart-count">{itemCount} item(s) in cart</div>

        {cart.map((product, index) => {
          const productId = product._id || product.id;
          return (
            <div className="cart-item-container" key={productId || index}>
              <input
                type="checkbox"
                defaultChecked
                style={{ marginRight: "10px" }}
              />

              <img
                src={product.image || product.images?.url}
                alt={product.title || ""}
              />

              <div className="cart-item-info">
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <p>Category: {product.category}</p>
                <p>
                  Rating: {product.rating?.rate} ({product.rating?.count}{" "}
                  reviews)
                </p>

                <div className="action-controls">
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(product)}
                  >
                    <MdDelete />
                  </button>
                  <div className="quantity-controls">
                    <button
                      onClick={() => updateCartQuantity(product, "decrement")}
                    >
                      -
                    </button>
                    <span>{product.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(product, "increment")}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="cart-item-price">
                ₹{(product.price * product.quantity).toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGHT: Summary + Razorpay */}
      <div className="cart-right">
        <div className="summary-box">
          <h3>Total Items: {itemCount}</h3>
          <h2>Total Price: ₹{total.toFixed(2)}</h2>

          <button
            className="checkout-btn"
            onClick={() => document.querySelector(".razorpay-btn").click()}
          >
            Proceed to Buy
          </button>

          <details className="emi-info">
            <summary>EMI Available</summary>
            <p>Installments available at checkout.</p>
          </details>
        </div>

        <div style={{ display: "none" }}>
          <RazorpayCheckoutButton cart={cart} />
        </div>
      </div>
    </div>
  );
}

export default Cart;
