import express from "express";
import Utilisateur from "../models/utilisateurModel.js";
import Annonce from "../models/annonceModel.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route pour récupérer tous les utilisateurs
router.get("/", async (req, res) => {
  try {
    const users = await Utilisateur.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour récupérer un utilisateur par ID
router.get("/:id", async (req, res) => {
  try {
    const user = await Utilisateur.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour créer un nouvel utilisateur
router.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Votre logique de validation et de création d'utilisateur

    const newUser = new Utilisateur({ username, email, password });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ROUTE MISE A JOUR
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    const requestingUserId = req.user.id;
    if (req.user.isAdmin || userId === requestingUserId) {
      const { username, email, password } = req.body;

      const updatedUser = await Utilisateur.findByIdAndUpdate(
        userId,
        { username, email, password },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      res.json(updatedUser);
    } else {
      res.status(403).json({ message: "Accès non autorisé" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ROUTE SUPPRESSION
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    const requestingUserId = req.user.id;

    // Vérifiez si l'utilisateur est l'administrateur ou l'utilisateur lui-même
    if (req.user.isAdmin || userId === requestingUserId) {
      const deletedUser = await Utilisateur.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      res.json({ message: "Utilisateur supprimé avec succès" });
    } else {
      res.status(403).json({ message: "Désolé ... Accès non autorisé" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour obtenir le nombre d'annonces d'un utilisateur
router.get("/:id/nombre-annonces", async (req, res) => {
  try {
    const userId = req.params.id;

    // Vérifiez si l'utilisateur existe
    const user = await Utilisateur.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Comptez le nombre d'annonces pour cet utilisateur
    const nombreAnnonces = await Annonce.countDocuments({
      utilisateur: userId,
    });

    res.status(200).json({ userId, nombreAnnonces });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
