const jwt = require("jsonwebtoken"); // Importing JWT library

const auth = (req, res, next) => {
  try {
    // Get token from the request header
    let token = req.header("Authorization");

    // 🔹 Debugging: Log received token
    console.log("Received Token:", token);

    // If token is missing, return an error
    if (!token) return res.status(400).json({ msg: "No token provided!" });
    if (token?.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    // Verify the token using JWT and secret key
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log("JWT Verification Error:", err.message);
        return res.status(400).json({ msg: "Invalid Authentication" });
      }
      // Attach the decoded user data to the request object
      req.user = user;

      // Call next() to proceed to the next middleware or route
      next();
    });
  } catch (err) {
    // Handle unexpected errors
    return res.status(500).json({ msg: err.message });
  }
};

// Export the middleware
module.exports = auth;
