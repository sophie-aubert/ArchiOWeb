import express from "express"; // N'oubliez pas d'importer express
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Utilisateur from "../models/utilisateurModel.js";

const router = express.Router(); // Créez une instance de Router

// Inscription d'un nouvel utilisateur
router.post("/inscription", async (req, res) => {
  try {
    console.log("Requête reçue avec le corps :", req.body);

    const { username, email, password } = req.body;
    console.log("Valeurs extraites :", username, email, password);

    // Vérifiez si l'utilisateur existe déjà
    const existingUser = await Utilisateur.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà" });
    }

    // Hash du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créez un nouvel utilisateur
    const nouvelUtilisateur = new Utilisateur({
      username,
      email,
      password: hashedPassword,
    });

    // Sauvegardez l'utilisateur dans la base de données
    await nouvelUtilisateur.save();

    // Générez le token JWT
    const token = jwt.sign(
      { user: { id: nouvelUtilisateur._id } },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // Vous pouvez ajuster la durée de validité du token
      }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error("Erreur :", error);
    res.status(500).json({ message: error.message });
  }
});

// Exportez la fonction pour qu'elle puisse être utilisée dans d'autres fichiers
export default router;
