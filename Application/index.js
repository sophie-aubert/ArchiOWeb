const express = require('express');
const app = express();
const port = 3000;

// Middleware pour gérer les données JSON
app.use(express.json());

// Routes de l'API
app.get('/', (req, res) => {
  res.send('Bienvenue sur mon API REST !');
});

// Écoute du serveur
app.listen(port, () => {
  console.log(`Le serveur écoute sur le port ${port}`);
});
