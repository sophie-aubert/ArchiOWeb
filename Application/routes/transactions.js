// transactions.js
import express from "express";
import Transaction from "../models/transactionModel.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Exemple: Protégez une route avec le middleware d'authentification
router.get("/transactions-protégées", authMiddleware, async (req, res) => {
  try {
    // Votre logique pour récupérer les transactions protégées
    // Vous pouvez utiliser req.user pour accéder aux informations de l'utilisateur authentifié

    const transactions = await Transaction.find({ user: req.user._id });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Autres routes liées aux transactions...

export default router;
