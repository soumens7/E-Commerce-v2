import React, { useContext, useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { GlobalState } from "../../../../GlobalState";
import { Link } from "react-router-dom";

function DetailProduct() {
  const params = useParams();
  console.log("URL Params:", params);

  const state = useContext(GlobalState);

  const products = useMemo(() => {
    return state?.productsAPI?.products || [];
  }, [state?.productsAPI?.products]);

  console.log("All Products:", products);
  const [DetailProduct, setDetailProduct] = useState({});

  useEffect(() => {
    if (params.id && Array.isArray(products) && products.length > 0) {
      // For FakeStore API, the id is numeric - convert params.id to Number
      const numericId = Number(params.id);
      console.log("Looking for product with ID:", numericId);

      const product = products.find((product) => product.id === numericId);
      console.log("Found product:", product);

      if (product) {
        setDetailProduct(product);
      }
    }
  }, [params.id, products]);

  if (Object.keys(DetailProduct).length === 0) return <div>Loading...</div>;

  return (
    <div className="details">
      {/* For FakeStore API, the image is probably at 'image' rather than 'images.url' */}
      <img src={DetailProduct.image} alt={DetailProduct.title || ""} />
      <div className="box-details">
        <div className="row">
          <h2>{DetailProduct.title}</h2>
          <h6>Product ID: {DetailProduct.id}</h6>
        </div>
        <span>${DetailProduct.price}</span>
        <p>{DetailProduct.description}</p>
        <p>Category: {DetailProduct.category}</p>
        <p>
          Rating: {DetailProduct.rating?.rate} ({DetailProduct.rating?.count}{" "}
          reviews)
        </p>
        <Link to="/cart" className="cart">
          Buy now
        </Link>
      </div>
    </div>
  );
}

export default DetailProduct;
