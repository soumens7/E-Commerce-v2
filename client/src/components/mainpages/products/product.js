import React, { useEffect, useState, useContext } from "react";
import ProductList from "../utils/ProductList/ProductList";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";

function Product() {
  const state = useContext(GlobalState);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [isAdmin] = state.userAPI.isAdmin;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products?limit=50");

      console.log("API Response:", res.data);

      setProducts(Array.isArray(res.data) ? res.data : res.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/products/categories");

      console.log("Categories:", res.data);

      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const filteredProducts = products
    .filter((product) =>
      product.title?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((product) =>
      selectedCategory ? product.category === selectedCategory : true
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? Number(a.price) - Number(b.price)
        : Number(b.price) - Number(a.price)
    );

  return (
    <div className="product-page">
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>

          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      <div className="products">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductList key={product.id} product={product} isAdmin={isAdmin} />
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
}

export default Product;
