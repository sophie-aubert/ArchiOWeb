const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/utilisateurModel");

// Route d'authentification
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect." });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      "secret_key",
      {
        expiresIn: "1h", // Optionnel : expire en 1 heure, ajuste selon tes besoins
      }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
