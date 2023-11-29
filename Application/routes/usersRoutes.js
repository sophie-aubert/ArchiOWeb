import express from "express";
import Utilisateur from "../models/utilisateurModel.js";
import Annonce from "../models/annonceModel.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const router = express.Router();

// RECUPERER TOUS LES UTILISATEURS
router.get("/", async (req, res) => {
  try {
    const users = await Utilisateur.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// RECUPERER UN UTILISATEUR AVEC ID
router.get("/:id", async (req, res) => {
  try {
    const user = await Utilisateur.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ROUTE CREATION UTILISATEUR
router.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new Utilisateur({ username, email, password });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ROUTE MISE A JOUR UTILISATEUR
// CONNEXION UTILISATEUR OU ADMIN
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    const requestingUserId = req.user.id;

    if (req.user.isAdmin || userId === requestingUserId) {
      let updateFields = {};
      const { username, email, password } = req.body;

      // Ne mettez à jour le mot de passe que s'il est fourni
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateFields = { username, email, password: hashedPassword };
      } else {
        updateFields = { username, email };
      }

      const updatedUser = await Utilisateur.findByIdAndUpdate(
        userId,
        updateFields,
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
// CONNEXION UTILISATEUR OU ADMIN
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    const requestingUserId = req.user.id;

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

// ROUTE NOMBRE D'ANNONCES D'UN UTILISATEUR
router.get("/:id/nombre-annonces", async (req, res) => {
  try {
    const userId = req.params.id;

    // Vérifiez si l'utilisateur existe
    const user = await Utilisateur.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Comptez le nombre d'annonces pour cet utilisateur en utilisant un pipeline d'agrégation
    const pipeline = [
      {
        $match: {
          utilisateur: mongoose.Types.ObjectId.createFromHexString(userId),
        },
      },
      { $group: { _id: null, nombreAnnonces: { $sum: 1 } } },
    ];

    const result = await Annonce.aggregate(pipeline);

    // Renvoyer le résultat
    res.status(200).json({
      userId,
      nombreAnnonces: result.length > 0 ? result[0].nombreAnnonces : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
