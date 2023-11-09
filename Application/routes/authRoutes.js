// authRoutes.js (Fichier de routes)
const express = require("express");
const router = express.Router();
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

    // Générer un token JWT et le renvoyer pour l'authentification
    // (vous aurez besoin d'un package pour gérer cela, comme jsonwebtoken)
    // Exemple :
    // const token = generateJWTToken(user);
    // res.json({ token });

    // Pour simplifier, vous devrez implémenter la génération de token JWT ici
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
