import express from "express";
//import mongoose from "mongoose";
const app = express();
const port = 3000;

// // Connexion à MongoDB avec Mongoose
// mongoose.connect(
//   "mongodb+srv://admin:TheNiche1234@clustertheniche.dzl3a3c.mongodb.net/AppTheNiche?retryWrites=true&w=majority",
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }
// );

// // Gestion de la connexion réussie
// mongoose.connection.on("connected", () => {
//   console.log("Connexion à MongoDB établie avec succès");
// });

// // Gestion des erreurs de connexion
// mongoose.connection.on("error", (err) => {
//   console.error("Erreur de connexion à MongoDB : " + err);
// });

// // Gestion des déconnexions
// mongoose.connection.on("disconnected", () => {
//   console.log("La connexion à MongoDB a été interrompue");
// });

app.use(express.json());

app.get("/", function (req, res, next) {
  res.send("Bienvenue sur mon API REST !");
});

app.listen(port, () => {
  console.log(
    `Même les serveurs ont des oreilles ! Celui-là écoute sur le port ${port}`
  );
});
