// app.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import utilisateursRoutes from "./routes/utilisateurs.js";
import authRoutes from "./routes/authRoutes.js";
import annonces from "./routes/annonces.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware pour permettre la gestion des données au format JSON
app.use(express.json());

//////////////////////APPEL DES ROUTES /////////////////////////////////

// Utilisez les fichiers de routes dans votre application
app.use("/utilisateurs", utilisateursRoutes);
app.use("/auth", authRoutes);
app.use("/annonces", annonces);

/////////////////////////////////////////////////////////////////////////

// BASE DE DONNEE
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connexion à MongoDB établie avec succès");

    //ajouter un utilisateur dans la base de données
    app.listen(port, () => {
      console.log(`Le serveur écoute sur le port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Erreur de connexion à MongoDB : " + err);
  });

// Gestion des erreurs non gérées
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});
