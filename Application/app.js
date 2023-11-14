import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
//import bcrypt from "bcrypt";
import Utilisateur from "./models/utilisateurModel.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware pour l'analyse du corps en JSON
app.use(express.json());

// Connexion à la base de données MongoDB
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Gestion de la connexion réussie
mongoose.connection.on("connected", () => {
  console.log("Connexion à MongoDB établie avec succès");
});

// Gestion des erreurs de connexion
mongoose.connection.on("error", (err) => {
  console.error("Erreur de connexion à MongoDB : " + err);
});

// Gestion des déconnexions
mongoose.connection.on("disconnected", () => {
  console.log("La connexion à MongoDB a été interrompue");
});

// Liste des utilisateurs de la base de données
app.get("/utilisateurs", async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.find();
    res.json(utilisateurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route POST pour la création d'un nouvel utilisateur
app.post("/utilisateurs", async (req, res) => {
  try {
    // Créer un nouvel utilisateur
    const nouvelUtilisateur = await Utilisateur.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    // Répondez avec l'utilisateur ajouté et un code de statut 201 Created
    res.status(201).json(nouvelUtilisateur);
  } catch (error) {
    // En cas d'erreur, répondez avec un code de statut 500 Internal Server Error
    res.status(500).json({ Beeeeeug: error.message });
  }
});

// Route d'accueil
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur mon API" });
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`Le serveur écoute sur le port ${port}`);
});
