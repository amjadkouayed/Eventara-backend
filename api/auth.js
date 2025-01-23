const express = require("express");
const router = express.Router();
const {
  registerUser,
  authenticateUser,
  issueJWT,
} = require("../service/auth-service");

// http://localhost:4000/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await authenticateUser(email, password);

    if (result.error) {
      return res.status(400).json({ message: result.message });
    }

    const jwt = issueJWT(result.userId);

    res.status(200).json({
      message: "successfully logged in",
      token: jwt.token,
      expiresIn: jwt.expires,
    });
  } catch (err) {
    res.status(400).json({ message: "error logging in", error: err.message });
  }
});

// http://localhost:4000/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "name, email and password required" });
  }

  try {
    const result = await registerUser(name, email, password);

    if (result.error) {
      return res.status(400).json(result.error);
    }

    res.status(200).json(result.message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "logout failed", error: err });
    }

    res.status(200).json({ message: "Successfully logged out" });
  });
});

module.exports = router;
