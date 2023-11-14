// annonces.js
import express from "express";
import Annonce from "../models/annonceModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  console.log("GET /annonces");
  try {
    const annonces = await Annonce.find().populate("utilisateur");
    res.json(annonces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  console.log("POST /annonces");
  try {
    const { titre, description, utilisateur } = req.body;

    const nouvelleAnnonce = new Annonce({
      titre,
      description,
      utilisateur,
    });

    const annonce = await nouvelleAnnonce.save();

    res.status(201).json(annonce);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
