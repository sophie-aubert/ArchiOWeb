// annonces.js
import express from "express";
import multer from "multer";
import Annonce from "../models/annonceModel.js";
import { broadcastMessage } from "../utils/messaging.js";
import { authAnnonceMiddleware } from "../middlewares/authAnnonceMiddleware.js";

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
    const { titre, description, utilisateur, categorie, latitude, longitude } =
      req.body;

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

// ROUTE AFFICHAGE ANNONCE PAR ID
router.get("/:id", async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);
    res.json(annonce);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ROUTE MIS A JOUR ANNONCE
router.put("/:id", authAnnonceMiddleware, async (req, res) => {
  try {
    const annonceId = req.params.id;
    const { titre, description, imageUrl } = req.body;

    // Vérifiez si l'annonce existe
    const annonce = await Annonce.findById(annonceId);
    if (!annonce) {
      return res.status(404).json({ message: "Annonce non trouvée" });
    }

    // Mettez à jour les champs spécifiés
    annonce.titre = titre || annonce.titre;
    annonce.description = description || annonce.description;
    annonce.imageUrl = imageUrl || annonce.imageUrl;
    // Sauvegardez les modifications
    const updatedAnnonce = await annonce.save();
    res.json(updatedAnnonce);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", authAnnonceMiddleware, async (req, res) => {
  try {
    const annonceId = req.params.id;

    // Vérifiez si l'annonce existe
    const annonce = await Annonce.findById(annonceId);
    if (!annonce) {
      return res.status(404).json({ message: "Annonce non trouvée" });
    }

    // Vérifiez si l'utilisateur est l'auteur de l'annonce ou est administrateur
    if (
      annonce.utilisateur.toString() !== req.user.id &&
      req.user.isAdmin === false
    ) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    // Supprimez l'annonce
    await Annonce.findByIdAndDelete(annonceId);

    res.json({ message: "Annonce supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
