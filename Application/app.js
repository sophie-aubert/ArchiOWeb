import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Utilisateur from "./models/utilisateurModel.js";

const app = express();
const port = 3000;
dotenv.config();

///////////////////////////////////
///////// TEST ////////////////////
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur mon API" });
});

// lister les utilisateurs de la base de données
app.get("/utilisateurs", async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.find();
    res.json(utilisateurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ajouter un utilisateur dans la base de données
app.post("/utilisateurs", async (req, res) => {
  try {
    const utilisateur = new Utilisateur({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    const newUtilisateur = await utilisateur.save();
    res.status(201).json(newUtilisateur);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// supprimer un utilisateur de la base de données

//////////////////////APPEL DES ROUTES /////////////////////////////////

// Importez les fichiers de routes
import utilisateursRoutes from "./routes/utilisateurs.js";
import annoncesRoutes from "./routes/annonces.js";
import transactionsRoutes from "./routes/transactions.js";

// Utilisez les fichiers de routes dans votre application
app.use("/utilisateurs", utilisateursRoutes);
app.use("/annonces", annoncesRoutes);
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

  // try {
  //   // On ajoute un 2eme utilisateur
  //   const monAutreUtilisateur = new Utilisateur({
  //     username: "Jane Doe",
  //     email: "jane.doe@example",
  //     password: "password",
  //   });

  //   await monAutreUtilisateur.save();

  //   console.log("Utilisateur ajouté avec succès !");
  // } catch (error) {
  //   console.error("Erreur lors de l'ajout de l'utilisateur : " + error);
  // }
});
