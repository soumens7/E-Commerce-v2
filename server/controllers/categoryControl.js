const prisma = require("../config/prisma");

const categoryControl = {
  getCategories: async (req, res) => {
    try {
      const categories = await prisma.category.findMany({
        orderBy: {
          created_at: "desc",
        },
      });

      res.json(categories);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createCategory: async (req, res) => {
    try {
      const { name } = req.body;

      const category = await prisma.category.findUnique({
        where: {
          name,
        },
      });

      if (category) {
        return res.status(400).json({
          msg: "This category already exists.",
        });
      }

      const newCategory = await prisma.category.create({
        data: {
          name,
        },
      });

      res.json({
        msg: "Created a category",
        category: newCategory,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      await prisma.category.delete({
        where: {
          id: req.params.id,
        },
      });

      res.json({
        msg: "Deleted a category",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { name } = req.body;

      const updatedCategory = await prisma.category.update({
        where: {
          id: req.params.id,
        },
        data: {
          name,
        },
      });

      res.json({
        msg: "Updated a category",
        category: updatedCategory,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = categoryControl;
