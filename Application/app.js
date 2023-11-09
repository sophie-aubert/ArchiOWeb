import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();

const port = 3000;
dotenv.config();

///////////////////////////////////
///////// TEST ////////////////////
app.get("/annonces", (req, res) => {
  res.json({ message: "Liste des annonces" });
});

//////////////////////APPEL DES ROUTES /////////////////////////////////

// Importez les fichiers de routes
import utilisateursRoutes from "./routes/utilisateurs.js";
import annoncesRoutes from "./routes/annonces.js";
import transactionsRoutes from "./routes/transactions.js";

// Utilisez les fichiers de routes dans votre application
app.use("/utilisateurs", utilisateursRoutes);
app.use("/annonces", annoncesRoutes);
app.use("/transactions", transactionsRoutes);

//////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////
// BASE DE DONNEE
/////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

app.get("/", function (req, res, next) {
  res.json({ message: "Bienvenue sur mon API REST !" });
});

app.listen(port, () => {
  console.log(
    `Même les serveurs ont des oreilles ! Celui-là écoute sur le port ${port}`
  );
});
