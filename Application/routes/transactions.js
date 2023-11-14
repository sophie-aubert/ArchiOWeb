// transactions.js
import express from "express";
import Transaction from "../models/transactionModel.js";

const router = express.Router();

// Route pour récupérer toutes les transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("annonce acheteur");
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour créer une nouvelle transaction
router.post("/", async (req, res) => {
  try {
    const { annonce, acheteur } = req.body;

    // Créez une nouvelle transaction
    const nouvelleTransaction = new Transaction({
      annonce,
      acheteur,
    });

    // Sauvegardez la transaction dans la base de données
    const transaction = await nouvelleTransaction.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Autres routes pour mettre à jour et supprimer des transactions...

export default router;
