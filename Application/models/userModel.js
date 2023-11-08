const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
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

const User = mongoose.model("User", userSchema);

module.exports = User;
