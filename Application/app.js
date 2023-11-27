// app.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import usersRoutes from "./routes/usersRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import annonces from "./routes/annonces.js";
import transactions from "./routes/transactions.js";
import { createWebSocketServer } from "./utils/messaging.js";
import http from "http";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware pour permettre la gestion des données au format JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//////////////////////APPEL DES ROUTES /////////////////////////////////

// Route de bienvenue
app.get("/", (req, res) => {
  res.send(
    "Bienvenue sur le vide dressing en ligne THE NICHE crée par : AUBERT SOPHIE, ESWARAN JASMINE, LOCATELLI MARCO ET PAPRACANIN FERIDA"
  );
});

// Utilisez les fichiers de routes dans votre application
app.use("/affiche", usersRoutes);
app.use("/auth", authRoutes);
app.use("/annonces", annonces);
app.use("/transactions", transactions);

/////////////////////////////////////////////////////////////////////////

// Création du serveur websocket

const server = http.createServer(app);
createWebSocketServer(server);

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

export default app;
