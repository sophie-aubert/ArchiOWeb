import express from "express";
import Transaction from "../models/transactionModel.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

const isAdminMiddleware = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    // L'utilisateur est un administrateur, passez à la suite
    next();
  } else {
    res.status(403).json({
      message:
        "Accès non autorisé. Seuls les administrateurs peuvent accéder à cette ressource.",
    });
  }
};

// ROUTE POUR RECUPERER TOUTES LES TRANSACTIONS
// seulement pour les admins
// Utilisez le middleware isAdminMiddleware pour protéger la route

router.get("/", authMiddleware, isAdminMiddleware, async (req, res) => {
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

// ROUTE POUR LISTER LES TRANSACTIONS D'UN UTILISATEUR
// CONNEXION UTILISATEUR OU ADMIN
router.get("/mesTransactions/:id", async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ acheteur: req.params.id }, { vendeur: req.params.id }],
    }).populate("annonce acheteur vendeur");
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
