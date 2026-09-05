import React from "react";
import Product from "./products/product.js";
import Login from "./login/login.js";
import Register from "./login/register.js";
import Cart from "./cart/cart.js";
import { Route, Routes } from "react-router-dom";
import DetailProduct from "./utils/DetailProducts/DetailProduct.js";

function Pages() {
  return (
    <Routes>
      <Route path="/" element={<Product />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/detail/:id" element={<DetailProduct />}></Route>
      <Route path="/cart" element={<Cart />} />
    </Routes>
  );
}

export default Pages;
