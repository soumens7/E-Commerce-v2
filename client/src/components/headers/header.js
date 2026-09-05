import React, { useContext, useState, useEffect, useRef } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { GlobalState } from "../../GlobalState";
import "./header.css";
import axios from "axios";

const Header = () => {
  const state = useContext(GlobalState);
  console.log("State:", state); // Log the state object
  const [isLogged, setIsLogged] = state.userAPI.isLogged;
  const [isAdmin, setIsAdmin] = state.userAPI.isAdmin;
  const [cart] = state.userAPI.cart;
  const itemCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const cartIconRef = useRef(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (cartIconRef.current) {
      setAnimate(true);
      const timeout = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [itemCount]);

  const logoutUser = async () => {
    await axios.get("/user/logout");

    localStorage.clear();

    setIsAdmin(false);
    setIsLogged(false);
  };

  const adminRouter = () => {
    return (
      <>
        <li>
          <Link to="/create_product">Create Product</Link>
        </li>
        <li>
          <Link to="/category">Categories</Link>
        </li>
      </>
    );
  };

  const loggedRouter = () => {
    return (
      <>
        {/* <li>
          <Link to="/history">History</Link>
        </li> */}
        <button className="header-btn">
          <Link to="/" onClick={logoutUser}>
            Logout
          </Link>
        </button>
      </>
    );
  };
  return (
    <header>
      <div className="menu">
        <GiHamburgerMenu size={30} />
      </div>

      <div className="logo">
        <h1>
          <Link to="/">{isAdmin ? "Admin" : "MERN Shopping Center"}</Link>
        </h1>
      </div>

      <ul>
        <li>
          <Link to="/">{isAdmin ? "Products" : "Shop"}</Link>
        </li>
        <li>
        {isAdmin && adminRouter()}
        {isLogged ? (
          loggedRouter()
        ) : (
          <button className="header-btn">
            <Link to="/login">Login / Register</Link>
          </button>
        )}
        </li>
        <li>
          <MdClose size={30} className="menu" />
        </li>
      </ul>
      {isAdmin ? (
        ""
      ) : (
        <div
          ref={cartIconRef}
          className={`cart-icon ${animate ? "pulse" : ""}`}
        >
          <span>{itemCount}</span>
          <Link to="/cart">
            <FaShoppingCart size={30} />
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
