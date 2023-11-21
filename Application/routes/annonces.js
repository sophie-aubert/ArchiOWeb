// annonces.js
import express from "express";
import Annonce from "../models/annonceModel.js";

const router = express.Router();

// Route pour la création d'une annonce avec gestion d'image via URL
router.post("/", async (req, res) => {
  try {
    const { titre, description, utilisateur, categorie, latitude, longitude, imageUrl } = req.body;

    // Créez une annonce avec l'URL de l'image
    const annonce = new Annonce({
      titre,
      description,
      utilisateur,
      categorie,
      latitude,
      longitude,
      imageUrl,
    });

    const newAnnonce = await annonce.save();

    res.status(201).json(newAnnonce);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route pour la récupération de toutes les annonces avec filtre par catégorie et pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filters = {};

    // Vérifie si la catégorie est spécifiée dans la requête
    if (req.query.categorie) {
      // Utilise une expression régulière insensible à la casse pour la comparaison
      filters.categorie = { $regex: new RegExp(req.query.categorie, "i") };
    }

    const annonces = await Annonce.find(filters)
      .populate("utilisateur")
      .skip(skip)
      .limit(limit)
      .exec();

    res.status(200).json(annonces);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// ... autres routes

export default router;
