import express from "express";
import Utilisateur from "../models/utilisateurModel.js";
import Annonce from "../models/annonceModel.js";

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

// Route pour mettre à jour un utilisateur par ID
router.put("/:id", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Votre logique de validation et de mise à jour d'utilisateur

    const updatedUser = await Utilisateur.findByIdAndUpdate(
      req.params.id,
      { username, email, password },
      { new: true } // Pour retourner la version mise à jour de l'utilisateur
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route pour supprimer un utilisateur par ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await Utilisateur.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({ message: "Utilisateur supprimé avec succès" });
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
