const axios = require("axios");
const prisma = require("../config/prisma");

const API_URL =
  "https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json";

async function importProducts() {
  try {
    console.log("Fetching products...");

    const response = await axios.get(API_URL);
    const products = response.data;

    console.log(`Fetched ${products.length} products.`);

    for (const product of products) {
      for (const product of products) {
        console.log(`Importing product ${product.id}: ${product.name}`);

        await prisma.product.upsert({
          where: {
            product_id: String(product.id),
          },
          update: {
            title: product.name,
            price: product.priceCents / 100,
            description: product.description,
            content: "",
            images: [product.image],
            category: product.category,
          },
          create: {
            product_id: String(product.id),
            title: product.name,
            price: product.priceCents / 100,
            description: product.description,
            content: "",
            images: [product.image],
            category: product.category,
            checked: false,
            sold: 0,
          },
        });
      }
    }

    console.log("Products imported successfully!");
  } catch (error) {
    console.error("Product import failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

importProducts();
