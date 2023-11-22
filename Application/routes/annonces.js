// annonces.js
import express from "express";
import multer from "multer"; // Ajout de Multer
import Annonce from "../models/annonceModel.js";

const router = express.Router();

// Configuration de Multer pour le stockage des images
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route pour la création d'une annonce avec gestion d'image via Multer
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      titre,
      description,
      utilisateur,
      categorie,
      latitude,
      longitude,
    } = req.body;

    // Créez une annonce avec les coordonnées GeoJSON et l'image
    const annonce = new Annonce({
      titre,
      description,
      utilisateur,
      categorie,
      geolocation: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      image: req.file.buffer, // Stockez l'image dans le modèle comme un tampon de mémoire
    });

    const newAnnonce = await annonce.save();

    res.status(201).json(newAnnonce);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ... autres routes

export default router;
