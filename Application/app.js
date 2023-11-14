import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import utilisateursRoutes from "./routes/utilisateurs.js";

const app = express();
const port = 3000;
dotenv.config();

///////////////////////////////////
///////// TEST ////////////////////
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur mon API" });
});

// supprimer un utilisateur de la base de données

//////////////////////APPEL DES ROUTES /////////////////////////////////

// Utilisez les fichiers de routes dans votre application
app.use("/utilisateurs", utilisateursRoutes);

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
