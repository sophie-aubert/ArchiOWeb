import express from "express";
const router = express.Router();
const app = express();

// Importez les modèles nécessaires
import Utilisateur from "../models/utilisateurModel.js";

// lister les utilisateurs de la base de données
app.get("/utilisateurs", async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.find();
    res.json(utilisateurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Définissez une route POST pour la création d'un nouvel utilisateur
router.post("/utilisateurs", async (req, res) => {
  try {
    // Récupérez les données de l'utilisateur à partir du corps de la requête
    const { username, email, password } = req.body;

    // Créez un nouvel utilisateur
    const nouvelUtilisateur = new Utilisateur({
      username,
      email,
      password,
    });

    // Sauvegardez l'utilisateur dans la base de données
    await nouvelUtilisateur.save();

    // Répondez avec l'utilisateur ajouté et un code de statut 201 Created
    res.status(201).json(nouvelUtilisateur);
  } catch (error) {
    // En cas d'erreur, répondez avec un code de statut 500 Internal Server Error
    res.status(500).json({ message: error.message });
  }
});

export default router;
