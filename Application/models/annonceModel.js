// annonceModel.js
import mongoose from "mongoose";

const categorieEnum = ["Chaussures", "Pantalons", "Chemises", "Pulls", "Vestes", "Manteaux", "Accessoires", "T-shirts"];

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
      ref: "Utilisateur",
      required: true,
    },
    // Ajouter la catégorie de l'annonce en tant qu'enum
    categorie: {
      type: String,
      required: true,
      enum: categorieEnum,
    },
    // Ajoutez les champs de géolocalisation
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    // Ajoutez le champ pour l'URL de l'image
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Annonce = mongoose.model("Annonce", annonceSchema);

export default Annonce;
