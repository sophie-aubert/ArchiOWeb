// utilisateur.js
import express from "express";
const router = express.Router();
import Utilisateur from "../models/utilisateurModel.js";

// Route pour lister tous les utilisateurs
router.get("/", async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.find();
    res.json(utilisateurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour créer un nouvel utilisateur
router.post("/", async (req, res) => {
  try {
    const existingUser = await Utilisateur.findOne({
      username: req.body.username,
    });

    if (existingUser) {
      return res.status(400).json({ message: "Nom d'utilisateur déjà pris." });
    }

    const nouvelUtilisateur = new Utilisateur({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    await nouvelUtilisateur.save();

    res.status(201).json(nouvelUtilisateur);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
