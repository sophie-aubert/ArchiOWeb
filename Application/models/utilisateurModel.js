import mongoose from "mongoose";

const utilisateurSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },

    prenom: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
    },

    ville: {
      type: String,
      required: true,
    },

    adresse: {
      type: String,
      required: true,
    },

    npa: {
      type: Number,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

const Utilisateur = mongoose.model("Utilisateur", utilisateurSchema);

export default Utilisateur;
