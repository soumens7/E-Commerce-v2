const prisma = require("../config/prisma"); // Importing the User model
const bcrypt = require("bcrypt"); // Importing bcrypt for password hashing
const jwt = require("jsonwebtoken"); // Importing JSON Web Token for authentication

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/user/refresh_token",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const userControl = {
  // Controller function for user registration
  register: async (req, res) => {
    try {
      // Destructuring name, email, and password from request body
      const { name, email, password } = req.body;

      // Check if all required fields are provided
      if (!name || !email || !password) {
        return res.status(400).json({ msg: "Please fill in all fields." });
      }

      // Check if the user already exists in the database
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (user) return res.status(400).json({ msg: "Email already exists." });

      // Ensure password length is at least 6 characters
      if (password.length < 6) {
        return res
          .status(400)
          .json({ msg: "Password must be at least 6 characters long." });
      }

      // Generate salt and hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user instance
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      // Create JWT access and refresh tokens
      const accessToken = createAccessToken({ id: newUser.id });
      const refreshToken = createRefreshToken({ id: newUser.id });

      // Store refresh token in HTTP-only cookie for security
      res.cookie("refreshtoken", refreshToken, refreshCookieOptions);

      // // Send access token in response
      res.json({ accessToken });
      // res.json({ accessToken, refreshToken });
    } catch (err) {
      console.error("Registration error:", err);
      return res
        .status(500)
        .json({ msg: "Something went wrong. Please try again" }); // Handle errors
    }
  },

  // Controller function to refresh the access token
  refreshToken: async (req, res) => {
    try {
      // Retrieve refresh token from cookies
      const rf_token = req.cookies?.refreshtoken;

      // Check if refresh token exists
      if (!rf_token)
        return res.status(401).json({ msg: "Please login or register" });

      // Verify the refresh token
      const decoded = jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET);
      if (!decoded.id) {
        return res
          .status(401)
          .json({ msg: "Invalid token, please login again." });
      }
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true },
      });
      if (!user) {
        return res.status(401).json({ msg: "User no longer exist." });
      }
      // Generate new access token
      const accessToken = createAccessToken({ id: user.id });
      return res.json({ accessToken });
    } catch (err) {
      if (
        err.name === "JsonWebTokenError" ||
        err.name === "TokenExpiredError" ||
        err.name === "NotBeforeError"
      ) {
        return res
          .status(401)
          .json({ msg: "Invalid or expired refresh token" });
      }
      return res.status(500).json({ msg: "Internal server error" });
    }
  },

  // Controller function for user login
  login: async (req, res) => {
    try {
      // Extract email and password from request body
      const { email, password } = req.body;

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      // Check if user exists
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      // Compare provided password with stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Incorrect password." });

      // Generate JWT access and refresh tokens
      const accessToken = createAccessToken({ id: user.id });
      const refreshToken = createRefreshToken({ id: user.id });

      // Store refresh token in HTTP-only cookie
      res.cookie("refreshtoken", refreshToken, refreshCookieOptions);

      // // Send access token in response
      res.json({ accessToken });
    } catch (err) {
      console.error("Login error:", err);
      return res
        .status(500)
        .json({ msg: "Something went wrong. Please try again" }); // Handle errors
    }
  },

  // Controller function for user logout
  logout: async (req, res) => {
    try {
      // Clear the refresh token from cookies
      res.clearCookie("refreshtoken", {
        ...refreshCookieOptions,
        maxAge: undefined,
      });
      return res.json({ msg: "Logged out!" });
    } catch (err) {
      return res.status(500).json({ msg: "Internal server error" }); // Handle errors
    }
  },

  // Controller function to fetch user data
  getUser: async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: req.user.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          cart: true,
          history: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Check if user exists
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      // Send user data in response
      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message }); // Handle errors
    }
  },
  addToCart: async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: req.user.id,
        },
      });
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      await prisma.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          cart: req.body.cart,
        },
      });
      res.json({ msg: "Cart updated successfully!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

// Function to create JWT access token
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m", // Access token expires in 15 mins
  });
};

// Function to create JWT refresh token
const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d", // Refresh token expires in 7 days
  });
};

// Export user controller
module.exports = userControl;
