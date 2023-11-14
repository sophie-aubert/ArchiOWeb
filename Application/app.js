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
    // Récupérez les données de l'utilisateur à partir du corps de la requête
    const { username, email, password } = req.body;

    // Hacher le mot de passe avant de le stocker dans la base de données
    //const hashedPassword = await bcrypt.hash(password, 10); // 10 est le coût du hachage, ajuste selon tes besoins

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

// Route d'accueil
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur mon API" });
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`Le serveur écoute sur le port ${port}`);
});
