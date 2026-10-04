# 🛒 E-Commerce App

A full-stack e-commerce web application built using React, Node.js, Express.js, PostgreSQL, and Prisma. Features authentication, product display, category filtering, cart functionality, and secure token management.

Check out the live version of the project [here](https://e-commerce-v2-peach.vercel.app/)

![Website Demo](https://media.giphy.com/media/w5PyNbZdeyqtYgtSFr/giphy.gif)

[![CI](https://github.com/soumens7/E-Commerce-v2/actions/workflows/ci.yml/badge.svg)](https://github.com/soumens7/E-Commerce-v2/actions)

## 🚀 Features

- 🔐 Secure Auth: JWT (Access + Refresh Token) with HttpOnly cookies
- 👤 User Login, Register, Logout
- 🛒 Add to Cart with Quantity Management
- 💾 Cart Saved to DB per User
- 📦 Product Display + Filtering + Sorting + Pagination
- 📁 Admin Dashboard for Categories & Products
- 🖼️ Product Images
- 💳 Razorpay Integration (Test & Live Ready)
- 🔄 Auto Token Refresh on Load
- 🔒 Protected Routes (Admin-only Access)
- 🌍 Fully CORS-safe Deployment
- 🧪 Token Expiry Retry Handling

---

## 📦 Tech Stack

**Frontend**:  
React, Context API, Axios, Razorpay Checkout, CSS

**Backend**:  
Node.js, Express.js, Prisma, PostgreSQL, Razorpay, JWT, Bcrypt, Cookie-Parser, CORS
**Database**: PostgreSQL with Prisma ORM

**Security**: JWT, HttpOnly Cookies, CORS, Environment Variables

---

## 🌐 Project Structure

```txt
client/
├── src/
│   ├── API/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   ├── GlobalState.js
│   └── App.js
server/
├── controllers/
├── middleware/
├── models/
├── routes/
├── scripts/
│   └── importProducts.js
├── config/
│   └── prisma.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── generated/
│   └── prisma/
├── server.js
└── .env
```

## 🗄️ Database

The application uses PostgreSQL as its database with Prisma ORM.

The main database tables currently include:

- `users`
- `products`
- `categories`
- `orders`

Product data is stored in PostgreSQL and served through the Express backend.

### Product Data

The product catalog is populated using the free [Free Ecommerce Products API](https://kolzsticks.github.io/Free-Ecommerce-Products-Api/).

Products are imported into the PostgreSQL database using:

```bash
node scripts/importProducts.js
```

The imported product records include product information such as title, price, description, category, product images, and ratings.

This allows the application to serve products from its own database instead of requesting product data from an external API each time the product page loads.

## 🌐 Product API

The frontend communicates with the Express backend for product data.

### Endpoints

```txt
GET    /api/products
GET    /api/products/category/:category
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id
```

The product listing API supports:

- Pagination
- Category filtering
- Title search
- Price filtering
- Sorting

# 🛠️ Getting Started Locally

## Clone project

## Local Development

git clone [https://github.com/yourname/ecommerce-app.git](https://github.com/soumens7/MERN-E-Commerce-App.git)

## ⚙️ Client Setup

cd client  
npm install  
npm start

## ⚙️ Server Setup

cd ../server  
npm install  
npm run dev

# 🔐 Environment Variables

## client/.env

REACT_APP_API_URL=http://localhost:4000

## server/.env

PORT=4000  
CLIENT_URL=http://localhost:3000  
ACCESS_TOKEN_SECRET=your_jwt_access_secret  
REFRESH_TOKEN_SECRET=your_jwt_refresh_secret  
RAZORPAY_KEY_ID=your_test_key_id  
RAZORPAY_KEY_SECRET=your_test_key_secret

## 🗃️ Prisma Setup

Generate the Prisma Client:

```bash
npx prisma generate
```

Apply database migrations:

```bash
npx prisma migrate deploy
```

For local development and schema changes:

```bash
npx prisma migrate dev
```

Open Prisma Studio:

```bash
npx prisma studio
```

# 📦 Deployment (Vercel + Render)

✅ Frontend: Deploy to Vercel

✅ Backend + DB: Deploy to Render

🛠️ Be sure to set all .env variables in both environments

⚠️ Set Razorpay keys properly for Test/Live Mode

# Contributions

Pull requests are welcome! For major changes, please open an issue first.
