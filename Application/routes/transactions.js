import express from "express";
const router = express.Router();

// Importez les modèles nécessaires
import Transaction from "../models/transactionModel.js";

// Route pour obtenir toutes les transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour obtenir une transaction spécifique par son ID
router.get("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour créer une nouvelle transaction
router.post("/", async (req, res) => {
  const transaction = new Transaction({
    numeroAnnonce: req.body.numeroAnnonce,
    buyer: req.body.buyer,
    seller: req.body.seller,
    status: req.body.status,
    // Autres détails de la transaction...
  });

  try {
    const nouvelleTransaction = await transaction.save();
    res.status(201).json(nouvelleTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route pour mettre à jour une transaction par son ID
router.patch("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    // Mettez à jour les champs nécessaires

    const transactionMiseAJour = await transaction.save();
    res.json(transactionMiseAJour);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour supprimer une transaction par son ID
router.delete("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    await transaction.remove();
    res.json({ message: "Transaction supprimée avec succès!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
