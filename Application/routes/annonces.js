import express from "express";
import multer from "multer";
import Annonce from "../models/annonceModel.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { broadcastMessage } from "../utils/messaging.js";
import { authAnnonceMiddleware } from "../middlewares/authAnnonceMiddleware.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ROUTE POUR RECUPERER TOUTES LES ANNONCES
router.get("/", async (req, res) => {
  try {
    const annonces = await Annonce.find();
    res.json(annonces);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

// *** NOUVEAU ***
// ROUTE POUR LISTER LES ANNONCES D'UN UTILISATEUR
// CONNEXION UTILISATEUR OU ADMIN
router.get("/mesAnnonces/:id", authMiddleware, async (req, res) => {
  try {
    const annonces = await Annonce.find({
      utilisateur: req.params.id,
    });
    res.json(annonces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ROUTE POUR CREER UNE ANNONCE
// CONNEXION UTILISATEUR OU ADMIN
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { titre, description, prix, categorie, latitude, longitude } =
      req.body;

    // Accédez à l'ID de l'utilisateur à partir du token dans le middleware d'authentification
    const utilisateur = req.user.id;

    const newAnnonce = new Annonce({
      titre,
      description,
      prix,
      utilisateur,
      categorie,
      geolocation: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });

    if (req.file) {
      newAnnonce.image = req.file.buffer;
    }

    const savedAnnonce = await newAnnonce.save();

    broadcastMessage("new_announcement", savedAnnonce);
    broadcastMessage("illustrative_message", {
      message: "This is an illustrative message.",
    });

    res.status(201).json(savedAnnonce);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ROUTE MIS A JOUR ANNONCE
// CONNECION UTILISATEUR OU ADMIN
router.put("/:id", authAnnonceMiddleware, async (req, res) => {
  try {
    const annonceId = req.params.id;
    const { titre, description, prix, imageUrl } = req.body;
    const annonce = await Annonce.findById(annonceId);
    if (!annonce) {
      return res.status(404).json({ message: "Annonce non trouvée" });
    }
    annonce.titre = titre || annonce.titre;
    annonce.description = description || annonce.description;
    annonce.prix = prix || annonce.prix;
    annonce.imageUrl = imageUrl || annonce.imageUrl;
    const updatedAnnonce = await annonce.save();
    res.json(updatedAnnonce);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ROUTE SUPPRESSION ANNONCE
// CONNEXION UTILISATEUR OU ADMIN
router.delete("/:id", authAnnonceMiddleware, async (req, res) => {
  try {
    const annonceId = req.params.id;
    const annonce = await Annonce.findById(annonceId);
    if (!annonce) {
      return res.status(404).json({ message: "Annonce non trouvée" });
    }

    if (
      annonce.utilisateur.toString() !== req.user.id &&
      req.user.isAdmin === false
    ) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }
    await Annonce.findByIdAndDelete(annonceId);
    res.json({ message: "Annonce supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
