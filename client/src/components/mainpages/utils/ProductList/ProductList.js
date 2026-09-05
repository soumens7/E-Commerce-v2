import React, { memo } from "react";
import BtnRender from "./BtnRender";

const ProductList = ({ product, isAdmin, addCart }) => {
  return (
    <div className="product_card">
      {isAdmin && <input type="checkbox" checked={product.checked} />}
      <img src={product.image} alt={product.title} loading="lazy"/>
      <div className="product_box">
        <h2>{product.title}</h2>
        <span>${product.price}</span>
        <p>{product.description}</p>
      </div>

      <BtnRender product={product} isAdmin={isAdmin} addCart={addCart} />
    </div>
  );
};

// Wrap the component with React.memo
export default memo(ProductList);
