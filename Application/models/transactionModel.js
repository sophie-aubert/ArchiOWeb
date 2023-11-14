import mongoose from "mongoose";
import Utilisateur from "./utilisateurModel.js";
import Annonce from "./annonceModel.js";

const transactionSchema = new mongoose.Schema(
  {
    numeroAnnonce: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Numero",
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utilisateur",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utilisateur",
    },
    status: {
      type: String,
      enum: ["En attente", "En cours", "Terminée", "Annulée"],
      default: "En attente",
    },
    // Autres détails de la transaction (méthode de paiement, date, etc.)
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
