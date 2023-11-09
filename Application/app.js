import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Utilisateur from "./models/utilisateurModel.js";

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

  try {
    // Connexion réussie à MongoDB, vous pouvez maintenant ajouter l'utilisateur
    const monUtilisateur = new Utilisateur({
      username: "test",
      email: "test.1@example",
      password: "test",
    });

    await monUtilisateur.save();
    console.log("Utilisateur ajouté avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur : " + error);
  }
});
