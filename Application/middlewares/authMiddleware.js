import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Utilisateur from "../models/utilisateurModel.js";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
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

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
