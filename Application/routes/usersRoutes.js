const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Utilisateur = require("../models/utilisateurModel");

// Route d'inscription
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hacher le mot de passe avant de le stocker dans la base de données
    const hashedPassword = await bcrypt.hash(password, 10); // 10 est le coût du hachage, ajuste selon tes besoins

    const user = await Utilisateur.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
