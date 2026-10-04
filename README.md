# 🛒 E-Commerce App

A full-stack e-commerce web application built using React, Node.js, Express.js, PostgreSQL, and Prisma. Features authentication, product display, category filtering, cart functionality, and secure token management.

Check out the live version of the project [here](https://e-commerce-v2-docker-front-end.onrender.com)

![Website Demo](https://media.giphy.com/media/w5PyNbZdeyqtYgtSFr/giphy.gif)

[![CI](https://github.com/soumens7/E-Commerce-v2/actions/workflows/ci.yml/badge.svg)](https://github.com/soumens7/E-Commerce-v2/actions)

## 🚀 Features

- 🔐 Secure Authentication — JWT-based access and refresh token authentication with HttpOnly cookies
- 👤 User Management — Register, login, and logout
- 🛒 Add to Cart with Quantity Management
- 💾 Persistent Cart — Cart data stored in PostgreSQL per user
- 📦 Product Catalogue — Product display, filtering, sorting, searching, and pagination
- 📁 Admin Dashboard — Manage products and categories
- 🖼️ Product Images — Product image support
- 💳 Razorpay Integration — Payment processing with test/live mode support
- 🔄 Automatic Token Refresh — Handles access-token expiration and refresh
- 🔒 Protected Routes — Admin-only access for protected operations
- 🌍 CORS Configuration — Configured for cross-origin frontend/backend communication
- 🧪 Token Expiry Handling — Automatic retry handling for expired authentication tokens
- 🐳 Dockerized Application — Frontend and backend containerized using Docker
- ⚙️ Docker Compose — Run frontend and backend together locally

---

## 📦 Tech Stack

**Frontend**:  
React, Context API, Axios, Razorpay Checkout, CSS, Nginx

**Backend**:  
Node.js, Express.js, Prisma, PostgreSQL, Razorpay, JWT, Bcrypt, Cookie-Parser, CORS
**Database**: PostgreSQL with Prisma ORM
**DevOps & Deployment**: Docker, Docker Compose, Nginx, Render

**Security**: JWT, HttpOnly Cookies, CORS, Environment Variables, Protected routes

---

## 🌐 Project Structure

```txt
ecommerce-v2-pg/
├── client/
│   ├── src/
│   │   ├── API/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── GlobalState.js
│   │   └── App.js
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── package-lock.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── scripts/
│   │   └── importProducts.js
│   ├── config/
│   │   └── prisma.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── prisma.config.ts
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── .env
├── .gitignore
├── docker-compose.yml
└── README.md

Environment files such as .env are excluded from version control.
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

The frontend communicates with the Express backend for product-related operations.

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

git clone [https://github.com/yourname/ecommerce-app.git](https://github.com/soumens7/E-Commerce-v2.git)

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
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id

## server/.env

PORT=4000  
CLIENT_URL=http://localhost:3000  
DATABASE_URL=your_postgresql_connection_string
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

# 🐳 Docker

The application is containerized using Docker.

The frontend and backend each have their own Dockerfile:

client/Dockerfile
server/Dockerfile

The frontend uses a multi-stage Docker build:

Node.js
↓
React production build
↓
Nginx
↓
Static frontend

The backend runs as a Node.js container:

Node.js
↓
Express
↓
Prisma
↓
PostgreSQL

## Docker Compose

Docker Compose is used to run the frontend and backend together.

The PostgreSQL database remains externally hosted using Neon.

Start the application

From the project root:

docker compose up --build

The services are exposed at:

Frontend:
http://localhost:3000

Backend:
http://localhost:4000
Stop the application
docker compose down

View running containers
docker compose ps

View backend logs
docker compose logs -f backend

View frontend logs
docker compose logs -f frontend

## Docker Architecture

                     Browser
                        │
                        │ :3000
                        ▼
              ┌──────────────────┐
              │ Frontend Container│
              │ React + Nginx     │
              └────────┬─────────┘
                       │
                       │ :4000
                       ▼
              ┌──────────────────┐
              │ Backend Container │
              │ Node + Express    │
              │ Prisma            │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │ Neon PostgreSQL   │
              └──────────────────┘

# 📦 Deployment

The application is containerized and deployed using Docker.

### Frontend

- Dockerized React application
- React production build generated during the Docker image build
- Nginx serves the generated static files
- Deployed as a Docker-based service on Render

## Backend

- Dockerized Node.js/Express application
- Prisma ORM
- PostgreSQL database hosted on Neon
- Deployed as a Docker-based Web Service on Render

## Database

- PostgreSQL
- Hosted on Neon

## CI

- GitHub Actions is used for continuous integration.
- The CI workflow is available at:
  .github/workflows/ci.yml

GitHub Actions is used for continuous integration.

# 💳 Razorpay

The application integrates Razorpay for payment processing.

The frontend uses the Razorpay Key ID to initialize the checkout experience.

The backend uses:

RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET

for server-side Razorpay operations.

For testing, use Razorpay test-mode credentials.

# 🔒 Security

The application implements several security mechanisms:

- JWT access and refresh tokens
- HttpOnly cookies
- Protected admin routes
- CORS configuration
- Environment-based secrets
- Password hashing with Bcrypt
- Server-side authentication checks
- Separate frontend and backend credentials

# 🤝 Contributions

Pull requests are welcome.

For major changes, please open an issue first to discuss the proposed changes.
