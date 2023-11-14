// annonceModel.js
import mongoose from "mongoose";

const annonceSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utilisateur", // Référence à votre modèle Utilisateur
      required: true,
    },
  },
  { timestamps: true }
);

const Annonce = mongoose.model("Annonce", annonceSchema);

export default Annonce;
