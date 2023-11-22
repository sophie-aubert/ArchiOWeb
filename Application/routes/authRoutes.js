import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Utilisateur from "../models/utilisateurModel.js";

const router = express.Router();

// ROUTE INSCRIPTION
router.post("/inscription", async (req, res) => {
  try {
    console.log("Requête reçue avec le corps :", req.body);

    const { username, email, password } = req.body;
    console.log("Valeurs extraites :", username, email, password);

    const existingUser = await Utilisateur.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nouvelUtilisateur = new Utilisateur({
      username,
      email,
      password: hashedPassword,
    });

    await nouvelUtilisateur.save();

    // TOKEN DE CRÉATION DE COMPTE
    const token = jwt.sign(
      { user: { id: nouvelUtilisateur._id, role: nouvelUtilisateur.role } },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(201).json({ token });
  } catch (error) {
    console.error("Erreur :", error);
    res.status(500).json({ message: error.message });
  }
});

// ROUTE CONNEXION
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Utilisateur.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }
    // TOKEN DE LOGIN

    const token = jwt.sign(
      { user: { id: user._id, role: user.role } },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
