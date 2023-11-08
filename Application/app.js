import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();
const port = 3000;

dotenv.config();

mongoose.connect(process.env.DATABASE_URL);

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

// app.use(express.json());

app.get("/", function (req, res, next) {
  res.send("Bienvenue sur mon API REST !");
});

app.listen(port, () => {
  console.log(
    `Même les serveurs ont des oreilles ! Celui-là écoute sur le port ${port}`
  );
});
