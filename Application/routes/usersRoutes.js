// usersRoutes.js (Fichier de routes)
const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Route d'inscription
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({ username, email, password });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
