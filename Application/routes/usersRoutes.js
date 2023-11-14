// usersRoutes.js (Fichier de routes)

import express from "express";
import Utilisateur from "../models/utilisateurModel.js";

const router = express.Router();

// Route d'inscription
router.get("/", async (req, res) => {
  try {
    const users = await Utilisateur.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
