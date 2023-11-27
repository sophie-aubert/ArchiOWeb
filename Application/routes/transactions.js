import express from "express";
import Transaction from "../models/transactionModel.js";

const router = express.Router();

// ROUTE POUR RECUPERER TOUTES LES TRANSACTIONS
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("annonce acheteur");
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ROUTE POUR CREER UNE TRANSACTION
router.post("/", async (req, res) => {
  try {
    const { annonce, prix, acheteur, vendeur } = req.body;
    const nouvelleTransaction = new Transaction({
      annonce,
      prix,
      acheteur,
      vendeur,
    });
    const transaction = await nouvelleTransaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
