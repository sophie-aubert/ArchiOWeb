// authAnnonceMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Annonce from "../models/annonceModel.js";

dotenv.config();

export const authAnnonceMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.user.id,
      isAdmin: decoded.user.role === "admin",
      username: decoded.user.username,
    };

    // Vérifier si l'utilisateur est administrateur
    if (req.user.isAdmin) {
      return next();
    }

    // Vérifier si l'utilisateur est le créateur de l'annonce
    const annonce = await Annonce.findById(req.params.id);
    if (!annonce) {
      return res.status(404).json({ message: "Annonce non trouvée" });
    }

    if (annonce.utilisateur.toString() === req.user.id) {
      return next();
    }

    return res.status(403).json({ message: "Accès non autorisé" });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
