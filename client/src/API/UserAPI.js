import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

function UserAPI(token) {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // User is logged out
    if (!token) {
      setIsLogged(false);
      setIsAdmin(false);
      setCart([]);
      return;
    }

    const getUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/infor`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIsLogged(true);
        setIsAdmin(res.data.role === 1);

        console.log("User Info:", res.data);

        setCart(res.data.cart || []);
      } catch (err) {
        console.error(
          "Failed to fetch user information:",
          err.response?.data || err.message
        );

        setIsLogged(false);
        setIsAdmin(false);
        setCart([]);
      }
    };

    getUser();
  }, [token]);

  const addCart = async (product) => {
    if (!isLogged) {
      return alert("Please login to continue buying");
    }

    console.log("Current cart before adding:", cart);
    console.log("Product being added:", product);

    const productId = product.id;

    const existingProduct = cart.find((item) => item.id === productId);

    if (!existingProduct) {
      const newProduct = {
        ...product,
        quantity: 1,
      };

      const updatedCart = [...cart, newProduct];

      console.log("Updated cart:", updatedCart);

      setCart(updatedCart);

      try {
        await axios.patch(
          `${API_URL}/user/addtocart`,
          { cart: updatedCart },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        console.error("❌ Failed to update cart:", err);
      }
    } else {
      alert("This product has been added to cart.");
    }
  };

  const removeFromCart = async (productId) => {
    const newCart = cart.filter((item) => item.id !== productId.id);

    setCart(newCart);

    try {
      await axios.patch(
        `${API_URL}/user/addtocart`,
        { cart: newCart },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("❌ Failed to update cart:", err);
    }
  };

  const updateCartQuantity = (product, action) => {
    const updatedCart = cart.map((item) => {
      if (item.id === product.id) {
        const newQuantity =
          action === "increment"
            ? item.quantity + 1
            : Math.max(1, item.quantity - 1);

        return {
          ...item,
          quantity: newQuantity,
        };
      }

      return item;
    });

    setCart(updatedCart);

    axios
      .patch(
        `${API_URL}/user/addtocart`,
        { cart: updatedCart },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .catch((err) => {
        console.error("❌ Failed to update cart quantity:", err);
      });
  };

  return {
    isLogged: [isLogged, setIsLogged],
    isAdmin: [isAdmin, setIsAdmin],
    cart: [cart, setCart],
    addCart,
    removeFromCart,
    updateCartQuantity,
  };
}

export default UserAPI;
