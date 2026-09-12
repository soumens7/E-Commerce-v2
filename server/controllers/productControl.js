const prisma = require("../config/prisma");

const productControl = {
  // Get products with filtering, sorting, and pagination
  getProducts: async (req, res) => {
    try {
      const { page = 1, limit = 50, sort, category, title } = req.query;

      const pageNumber = Number(page);
      const limitNumber = Number(limit);

      const where = {};

      if (category) {
        where.category = category;
      }

      if (title) {
        where.title = {
          contains: title,
          mode: "insensitive",
        };
      }

      let orderBy = {
        createdAt: "desc",
      };

      if (sort) {
        const descending = sort.startsWith("-");
        const field = descending ? sort.substring(1) : sort;

        orderBy = {
          [field]: descending ? "desc" : "asc",
        };
      }

      const products = await prisma.product.findMany({
        where,
        orderBy,
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
      });

      // Keep the frontend compatible with the old API.
      // Your database stores images as a JSON array,
      // while the old frontend expects product.image.
      const formattedProducts = products.map((product) => ({
        ...product,
        image: Array.isArray(product.images)
          ? product.images[0]
          : product.images,
      }));

      res.json(formattedProducts);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getProduct: async (req, res) => {
    try {
      const product = await prisma.product.findUnique({
        where: {
          id: req.params.id,
        },
      });

      if (!product) {
        return res.status(404).json({ msg: "Product does not exist." });
      }

      const formattedProduct = {
        ...product,
        image: Array.isArray(product.images)
          ? product.images[0]
          : product.images,
      };

      res.json(formattedProduct);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getProductById: async (req, res) => {
    try {
      const product = await prisma.product.findUnique({
        where: {
          id: req.params.id,
        },
      });
  
      if (!product) {
        return res.status(404).json({
          msg: "Product not found.",
        });
      }
  
      res.json(product);
    } catch (err) {
      console.error("Get product error:", err);
  
      return res.status(500).json({
        msg: err.message,
      });
    }
  },

  // Create product
  createProduct: async (req, res) => {
    try {
      const {
        product_id,
        title,
        price,
        description,
        content,
        images,
        category,
      } = req.body;

      if (!product_id || !title || !price || !description || !category) {
        return res.status(400).json({
          msg: "Please provide all required product fields.",
        });
      }

      if (!images) {
        return res.status(400).json({
          msg: "No image upload",
        });
      }

      // Check whether product already exists
      const product = await prisma.product.findUnique({
        where: {
          product_id,
        },
      });

      if (product) {
        return res.status(400).json({
          msg: "This product already exists.",
        });
      }

      const newProduct = await prisma.product.create({
        data: {
          product_id,
          title: title.toLowerCase(),
          price: Number(price),
          description,
          content: content || "",
          images,
          category,
        },
      });

      res.json({
        msg: "Product created successfully!",
        newProduct,
      });
    } catch (err) {
      console.error("Create product error:", err);
      return res.status(500).json({ msg: err.message });
    }
  },
  getCategories: async (req, res) => {
    try {
      const categories = await prisma.product.findMany({
        distinct: ["category"],
        select: {
          category: true,
        },
        orderBy: {
          category: "asc",
        },
      });

      const categoryNames = categories.map((item) => item.category);

      res.json(categoryNames);
    } catch (err) {
      console.error("Get categories error:", err);

      return res.status(500).json({
        msg: err.message,
      });
    }
  },

  // Delete product
  deleteProduct: async (req, res) => {
    try {
      await prisma.product.delete({
        where: {
          id: req.params.id,
        },
      });

      res.json({
        msg: "Deleted a product",
      });
    } catch (err) {
      console.error("Delete product error:", err);
      return res.status(500).json({ msg: err.message });
    }
  },

  // Update product
  updateProduct: async (req, res) => {
    try {
      const { title, price, description, content, images, category } = req.body;

      const data = {};

      if (title !== undefined) {
        data.title = title.toLowerCase();
      }

      if (price !== undefined) {
        data.price = Number(price);
      }

      if (description !== undefined) {
        data.description = description;
      }

      if (content !== undefined) {
        data.content = content;
      }

      if (images !== undefined) {
        data.images = images;
      }

      if (category !== undefined) {
        data.category = category;
      }

      const updatedProduct = await prisma.product.update({
        where: {
          id: req.params.id,
        },
        data,
      });

      res.json({
        msg: "Updated a product",
        product: updatedProduct,
      });
    } catch (err) {
      console.error("Update product error:", err);
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = productControl;
