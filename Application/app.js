// Importez les fichiers de routes
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Utilisateur from "./models/utilisateurModel.js";
import utilisateursRoutes from "./routes/utilisateurs.js";
import authRoutes from "./routes/authRoutes.js";
import annonces from "./routes/annonces.js";
import transactionsRoutes from "./routes/transactions.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Ajout de la déclaration de la variable port

// Middleware pour permettre la gestion des données au format JSON
app.use(express.json());

///////////////////////////////////
///////// TEST ////////////////////
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur mon API" });
});

//////////////////////APPEL DES ROUTES /////////////////////////////////

// Utilisez les fichiers de routes dans votre application
app.use("/utilisateurs", utilisateursRoutes);
app.use("/auth", authRoutes); // Utilisez un chemin approprié pour les routes d'authentification
app.use("/annonces", annonces);
app.use("/transactions", transactionsRoutes);

/////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////
// BASE DE DONNEE
/////////////////////////////////////////////////////////////////////////
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

//ajouter un utilisateur dans la base de données
app.listen(port, async () => {
  console.log(
    `Même les serveurs ont des oreilles ! Celui-là écoute sur le port ${port}`
  );
});

//ok
