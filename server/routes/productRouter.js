const router = require("express").Router();

const productControl = require("../controllers/productControl");

// Get all products
router.get("/products", productControl.getProducts);

// Get categories
router.get("/products/categories", productControl.getCategories);

// Get products by category
router.get(
  "/products/category/:category",
  (req, res, next) => {
    req.query.category = req.params.category;
    next();
  },
  productControl.getProducts
);
// Get single product
router.get("/products/:id", productControl.getProductById);
// Create product
router.post("/products", productControl.createProduct);

// Delete product
router.delete("/products/:id", productControl.deleteProduct);

// Update product
router.patch("/products/:id", productControl.updateProduct);

module.exports = router;
