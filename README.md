# 🛒 MERN E-Commerce App

A full-stack e-commerce web application built using the MERN stack (MongoDB, Express, React, Node.js). Features authentication, product display, category filtering, cart functionality, and secure token management.

Check out the live version of the project [here](https://mern-e-commerce-app-tau.vercel.app/)

![Website Demo](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjFtMTU5djVtZmtvdDZ5enE1dm8yczE1d29iajlqbGx0bGw2YWhyMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vwuggOp6YZj2W9Z7H4/giphy.gif)

[![CI](https://github.com/soumens7/MERN-E-Commerce-App/actions/workflows/ci.yml/badge.svg)](https://github.com/soumens7/MERN-E-Commerce-App/actions)

## 🚀 Features

- 🔐 Secure Auth: JWT (Access + Refresh Token) with HttpOnly cookies
- 👤 User Login, Register, Logout
- 🛒 Add to Cart with Quantity Management
- 💾 Cart Saved to DB (MongoDB) per User
- 📦 Product Display + Filtering + Sorting
- 📁 Admin Dashboard for Categories & Products
- 🖼️ Products via FakeStore API
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
Node.js, Express.js, MongoDB, Mongoose, Razorpay, JWT, Bcrypt, Cookie-Parser, CORS
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
├── server.js
└── .env
```

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
MONGODB_URL=your_mongodb_uri  
ACCESS_TOKEN_SECRET=your_jwt_access_secret  
REFRESH_TOKEN_SECRET=your_jwt_refresh_secret  
RAZORPAY_KEY_ID=your_test_key_id  
RAZORPAY_KEY_SECRET=your_test_key_secret

# 📦 Deployment (Vercel + Render)

✅ Frontend: Deploy to Vercel

✅ Backend + DB: Deploy to Render

🛠️ Be sure to set all .env variables in both environments

⚠️ Set Razorpay keys properly for Test/Live Mode

# Contributions

Pull requests are welcome! For major changes, please open an issue first.
