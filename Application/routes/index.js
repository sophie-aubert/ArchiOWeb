import express from "express";
const router = express.Router();
const port = 8000;

router.get("/", function (req, res, next) {
  res.send("Bienvenue sur mon API REST !");
});

// Écoute du serveur
app.listen(port, () => {
  console.log(
    `Même les serveurs ont des oreilles ! Celui-là écoute sur le port ${port}`
  );
});

export default router;

////////////////
// const express = require("express");
// const app = express();
// const port = 8000;

// Middleware pour gérer les données JSON
// app.use(express.json());

// // Imports en tout genre :
// const Annonce = require("./StructureAnnonce");

// // Routes de l'API
// app.get("/", (req, res) => {
//   res.send("Bienvenue sur mon API REST !");
// });

// Écoute du serveur
// app.listen(port, () => {
//   console.log(
//     `Même les serveurs ont des oreilles ! Celui-là écoute sur le port ${port}`
//   );
// });

// const annonce = {
//   id: String, // Identifiant unique de l'habit
//   name: String, // Nom de l'habit
//   description: String, // Description de l'habit
// };
