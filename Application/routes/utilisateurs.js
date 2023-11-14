import express from "express";
import authRoutes from "./authRoutes.js"; // Importez le fichier directement

const router = express.Router();

// Liste des utilisateurs
router.get("/", async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.find();
    res.json(utilisateurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Utilisez les routes d'authentification
router.use("/auth", authRoutes);

export default router;
