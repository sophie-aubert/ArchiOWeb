// annonces.js
import express from "express";
import multer from "multer"; // Ajout de Multer
import Annonce from "../models/annonceModel.js";
import { broadcastMessage } from "../utils/messaging.js";

const router = express.Router();

// Route qui liste toutes les annonces
router.get("/", async (req, res) => {
  try {
    const annonces = await Annonce.find();
    res.json(annonces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour annoncer un nouvel article
router.post("/", function (req, res, next) {
  // Do stuff...

  // Notify users about the new announcement
  broadcastMessage({ announcement: "New announcement posted!" });

  res.status(200).json({ message: "Announcement posted successfully" });
});

// Configuration de Multer pour le stockage des images
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route pour la création d'une annonce avec gestion d'image via Multer
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { titre, description, utilisateur, categorie, latitude, longitude } =
      req.body;

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
