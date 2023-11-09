import mongoose from "mongoose";

const utilisateurSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // Autres informations liées à l'utilisateur (adresse, préférences, etc.)
  },
  { timestamps: true }
);

const Utilisateur = mongoose.model("Utilisateur", utilisateurSchema);

export default Utilisateur;
