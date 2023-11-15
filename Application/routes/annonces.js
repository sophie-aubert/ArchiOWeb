// annoncesRoutes.js (Fichier de routes)

import express from "express";
import Annonce from "../models/annonceModel.js";

const router = express.Router();

// Route pour récupérer toutes les annonces
router.get("/", async (req, res) => {
  try {
    const annonces = await Annonce.find();
    res.json(annonces);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour récupérer une annonce par ID
router.get("/:id", async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);
    if (!annonce) {
      return res.status(404).json({ message: "Annonce non trouvée" });
    }
    res.json(annonce);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour créer une nouvelle annonce
router.post("/", async (req, res) => {
  try {
    const { titre, description, utilisateur, categorie, latitude, longitude } =
      req.body;

    // Votre logique de validation et de création d'annonce

    const nouvelleAnnonce = new Annonce({
      titre,
      description,
      utilisateur,
      categorie,
      latitude,
      longitude,
    });

    const savedAnnonce = await nouvelleAnnonce.save();

    res.status(201).json(savedAnnonce);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route pour mettre à jour une annonce par ID
router.put("/:id", async (req, res) => {
  try {
    const { titre, description, utilisateur, categorie, latitude, longitude } =
      req.body;

    // Votre logique de validation et de mise à jour d'annonce

    const updatedAnnonce = await Annonce.findByIdAndUpdate(
      req.params.id,
      { titre, description, utilisateur, categorie, latitude, longitude },
      { new: true } // Pour retourner la version mise à jour de l'annonce
    );

    if (!updatedAnnonce) {
      return res.status(404).json({ message: "Annonce non trouvée" });
    }

    res.json(updatedAnnonce);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route pour supprimer une annonce par ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedAnnonce = await Annonce.findByIdAndDelete(req.params.id);

    if (!deletedAnnonce) {
      return res.status(404).json({ message: "Annonce non trouvée" });
    }

    res.json({ message: "Annonce supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;