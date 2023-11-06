const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(bodyParser.json());

// Exemple de stockage des utilisateurs (à remplacer par une base de données)
const users = [];

// Route d'inscription
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  // Vérification si l'utilisateur existe déjà
  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ message: "Cet utilisateur existe déjà." });
  }

  // Hashage du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Enregistrement de l'utilisateur (simulé ici)
  users.push({ username, password: hashedPassword });

  res.status(201).json({ message: "Inscription réussie." });
});
