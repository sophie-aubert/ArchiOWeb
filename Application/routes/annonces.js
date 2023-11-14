// annonces.js
import express from "express";
import Annonce from "../models/annonceModel.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Exemple: Protégez une route avec le middleware d'authentification
router.get("/annonces-protégées", authMiddleware, async (req, res) => {
  // Votre logique pour récupérer les annonces protégées
  // Vous pouvez utiliser req.user pour accéder aux informations de l'utilisateur authentifié
});

// Autres routes liées aux annonces...

export default router;
