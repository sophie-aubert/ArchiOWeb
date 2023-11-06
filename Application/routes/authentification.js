// Route d'authentification
app.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  // Recherche de l'utilisateur dans la liste (à remplacer par une vérification dans la base de données)
  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé." });
  }

  // Vérification du mot de passe
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: "Mot de passe incorrect." });
  }

  // Création du JWT
  const token = jwt.sign({ username: user.username }, "your_secret_key", {
    expiresIn: "1h",
  });

  res.json({ token });
});
