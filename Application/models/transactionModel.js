// transactionModel.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    annonce: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Annonce", // Référence à votre modèle Annonce
      required: true,
    },
    acheteur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utilisateur", // Référence à votre modèle Utilisateur
      required: true,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
