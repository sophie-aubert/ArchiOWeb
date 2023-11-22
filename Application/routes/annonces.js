// annonces.js
import express from "express";
import multer from "multer";
import Annonce from "../models/annonceModel.js";
import { broadcastMessage } from "../utils/messaging.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route qui liste toutes les annonces
router.get("/", async (req, res) => {
  try {
    const annonces = await Annonce.find();
    res.json(annonces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour annoncer un nouvel article avec ou sans image
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

    const newAnnonce = new Annonce({
      titre,
      description,
      utilisateur,
      categorie,
      geolocation: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });

    if (req.file) {
      // Si une image est fournie, stockez-la dans le modèle comme un tampon de mémoire
      newAnnonce.image = req.file.buffer;
    }

    const savedAnnonce = await newAnnonce.save();

    // Notify users about the new announcement
    broadcastMessage({ announcement: "New announcement posted!" });

    res.status(201).json(savedAnnonce);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ... autres routes

export default router;
