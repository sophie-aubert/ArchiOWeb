import express from "express";
import multer from "multer";
import Annonce from "../models/annonceModel.js";

const router = express.Router();

// Route pour la création d'une annonce avec gestion d'une URL externe
router.post("/", async (req, res) => {
  try {
    const {
      titre,
      description,
      utilisateur,
      categorie,
      latitude,
      longitude,
      imageUrl,
    } = req.body;

    // Téléchargez l'image depuis l'URL externe
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

    if (!response.data || response.data.length === 0) {
      return res
        .status(400)
        .json({
          message: "L'image n'a pas pu être téléchargée depuis l'URL externe.",
        });
    }

    const imageBuffer = Buffer.from(response.data, "binary");

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
      imageUrl: imageUrl, // Modification ici pour utiliser l'URL de l'image
    });

    const newAnnonce = await annonce.save();

    res.status(201).json(newAnnonce);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
