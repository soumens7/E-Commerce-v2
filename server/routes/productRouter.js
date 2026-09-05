const router = require("express").Router();
const axios = require("axios");

// Helper to normalize DummyJSON categories (so your frontend stays consistent)
const CATEGORY_MAP = {
  "electronics": "smartphones",
  "men's clothing": "mens-shirts",
  "women's clothing": "womens-dresses",
  "jewelery": "womens-jewellery",
};
// Normalize DummyJSON product → FakeStore-like
const normalizeProduct = (p) => ({
  id: p.id,
  title: p.title,
  price: p.price,
  category: p.category,        // slug, but your UI may just display it
  description: p.description,
  image: p.thumbnail || p.images?.[0] || "",  // FakeStore expects `image`
  rating: { rate: p.rating, count: p.stock }, // rough mapping if you need it
});
router.get("/products", async (req, res) => {
  const category = req.query.category; // e.g. /products?category=electronics

  try {
    // --- Try FakeStore first ---
    let url = "https://fakestoreapi.com/products";
    if (category) {
      url = `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`;
    }

    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    return res.json(response.data);
  } catch (err) {
    console.error("❌ FakeStore failed, trying DummyJSON...");
  }

  try {
    // --- Fallback: DummyJSON ---
    let url = "https://dummyjson.com/products?limit=100";

    if (category) {
      // map to DummyJSON’s category if known
      const mapped = CATEGORY_MAP[category.toLowerCase()] || category;
      url = `https://dummyjson.com/products/category/${encodeURIComponent(mapped)}?limit=100`;
    }

    const fallback = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const products = fallback.data.products || fallback.data;
    res.json(products);
  } catch (error) {
    console.error("❌ DummyJSON also failed:", error.message);
    res.status(500).json({ msg: "Both APIs failed" });
  }
});

router.get("/products/categories", async (req, res) => {
  try {
    const response = await axios.get("https://fakestoreapi.com/products/categories", {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    res.json(response.data);
  } catch (err) {
    console.error("❌ FakeStore failed, trying DummyJSON...");
    try {
      const response = await axios.get("https://dummyjson.com/products/categories");
      const categories = response.data.map((cat) => cat.name || cat.slug || cat);
      return res.json(categories);
    } catch (error) {
      console.error("❌ DummyJSON categories failed:", error.message);
      return res.status(500).json({ msg: "Error fetching categories" });
    }
  }
});

module.exports = router;
