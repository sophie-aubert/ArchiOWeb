import express from "express";
const router = express.Router();

// Importez les modèles nécessaires
import Annonce from "../models/annonceModel.js";

// Route pour obtenir toutes les annonces
router.get("/", async (req, res) => {
  try {
    const annonces = await Annonce.find();
    res.json(annonces);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour obtenir une annonce spécifique par son ID
router.get("/:id", async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);
    res.json(annonce);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour créer une nouvelle annonce
router.post("/", async (req, res) => {
  const annonce = new Annonce({
    titre: req.body.titre,
    description: req.body.description,
    prix: req.body.prix,
    categorie: req.body.categorie,
    utilisateur: req.body.utilisateur,
    images: req.body.images,
  });

  try {
    const nouvelleAnnonce = await annonce.save();
    res.status(201).json(nouvelleAnnonce);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route pour mettre à jour une annonce par son ID
router.patch("/:id", async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);
    if (req.body.titre) {
      annonce.titre = req.body.titre;
    }
    // Ajoute d'autres champs que tu veux mettre à jour

    const annonceMiseAJour = await annonce.save();
    res.json(annonceMiseAJour);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour supprimer une annonce par son ID
router.delete("/:id", async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);
    await annonce.remove();
    res.json({ message: "Annonce supprimée avec succès!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
