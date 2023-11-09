const mongoose = "mongoose";

const annonceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      // Vous pouvez utiliser une enum ou une référence à une autre collection pour les catégories
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    images: [String], // Liens vers les images de l'annonce
    // Autres détails de l'annonce (emplacement, état, etc.)
  },
  { timestamps: true }
);

const Annonce = mongoose.model("Annonce", annonceSchema);

// on exporte Annonce pour pouvoir l'utiliser dans d'autres fichiers
export default Annonce;
