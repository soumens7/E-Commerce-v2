const express = require("express");
const prisma = require("./config/prisma");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 4000;

//const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// Middleware
app.use(express.json());
app.use(cookieParser());
app.get("/debug-cookies", (req, res) => {
  res.json({ cookies: req.cookies });
});

// CORS middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://e-commerce-v2-peach.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    exposedHeaders: ["set-cookie"],
    methods: ["POST", "GET", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use((req, res, next) => {
  res.setTimeout(10000, () => {
    console.warn("⏳ Request timed out");
    res.status(503).json({ msg: "Server timeout, try again." });
  });
  next();
});

// Middleware to set Permissions-Policy header (at the top)
app.use((req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );
  //console.log("Permissions-Policy Header Set:", res.get("Permissions-Policy")); // Log the header
  next();
});

// Middleware
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(express.urlencoded({ extended: true }));

async function startServer() {
  try {
    await prisma.$connect();
    console.log("PostgreSQL Connected");

    app.use("/user", require("./routes/userRouter.js"));
    app.use("/api", require("./routes/categoryRouter.js"));
    app.use("/api/upload", require("./routes/upload.js"));
    app.use("/api", require("./routes/productRouter.js"));
    app.use("/api/payment", require("./routes/paymentRouter"));

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("PostgreSQL Connection Error ❌:", err);
    process.exit(1);
  }
}

// Base route
app.get("/", (req, res) => {
  res.send("Hello World");
});
startServer();
