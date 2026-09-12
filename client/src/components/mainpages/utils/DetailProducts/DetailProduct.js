import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function DetailProduct() {
  const { id } = useParams();

  const [detailProduct, setDetailProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        console.log("Fetching product:", id);

        const res = await axios.get(`/api/products/${id}`);

        console.log("Product response:", res.data);

        setDetailProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);

        setError(err.response?.data?.msg || "Unable to load product.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!detailProduct) {
    return <div>Product not found.</div>;
  }

  const productImage = Array.isArray(detailProduct.images)
    ? detailProduct.images[0]
    : detailProduct.images;

  return (
    <div className="details">
      <img src={productImage} alt={detailProduct.title} />

      <div className="box-details">
        <div className="row">
          <h2>{detailProduct.title}</h2>

          <h6>Product ID: {detailProduct.product_id}</h6>
        </div>

        <span>${detailProduct.price}</span>

        <p>{detailProduct.description}</p>

        <p>Category: {detailProduct.category}</p>

        <Link to="/cart" className="cart">
          Buy now
        </Link>
      </div>
    </div>
  );
}

export default DetailProduct;
