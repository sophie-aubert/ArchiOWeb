import mongoose from "mongoose";
import Utilisateur from "./utilisateurModel.js";

const annonceSchema = new mongoose.Schema(
  {
    idAnnonce: {
      type: String,
      required: true,
    },

    titre: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    prix: {
      type: Number,
      required: true,
    },

    categorie: {
      type: String,
      // Vous pouvez utiliser une enum ou une référence à une autre collection pour les catégories
    },

    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utilisateur",
    },
    images: [String], // Liens vers les images de l'annonce
    // Autres détails de l'annonce (emplacement, état, etc.)
  },
  { timestamps: true }
);

const Annonce = mongoose.model("Annonce", annonceSchema);

// On exporte Annonce pour pouvoir l'utiliser dans d'autres fichiers
export default Annonce;
