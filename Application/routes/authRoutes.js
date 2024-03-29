import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Utilisateur from "../models/utilisateurModel.js";
import Annonce from "../models/annonceModel.js";

const router = express.Router();

// ROUTE INSCRIPTION
/**
 * @api {post} /auth/inscription Enregistrer un nouvel utilisateur
 * @apiName RegisterUser
 * @apiGroup Authentification
 *
 *  @apiExample Example :
 *    https://thenicheapp.onrender.com/auth/inscription
 *
 * @apiParam {String} username User's username.
 * @apiParam {String} email User's email address.
 * @apiParam {String} password User's password.
 *
 * @apiSuccess {String} token Authentication token.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "token": "example-token-string"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "This user already exists"
 *     }
 */
router.post("/inscription", async (req, res) => {
  try {
    console.log("Requête reçue avec le corps :", req.body);

    const { nom, prenom, username, email, password, ville, adresse, npa } =
      req.body;
    console.log(
      "Valeurs extraites :",
      nom,
      prenom,
      username,
      email,
      password,
      ville,
      adresse,
      npa
    );

    const existingUser = await Utilisateur.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nouvelUtilisateur = new Utilisateur({
      nom,
      prenom,
      username,
      email,
      password: hashedPassword,
      ville,
      adresse,
      npa,
    });

    await nouvelUtilisateur.save();

    // TOKEN DE CRÉATION DE COMPTE
    const token = jwt.sign(
      { user: { id: nouvelUtilisateur._id, role: nouvelUtilisateur.role } },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(201).json({ token });
  } catch (error) {
    console.error("Erreur :", error);
    res.status(500).json({ message: error.message });
  }
});

// ROUTE CONNEXION
/**
 * @api {post} /auth/login Authentifier et connecter un utilisateur
 * @apiGroup Authentification
 *
 *
 * @apiParam {String} email User's email address.
 * @apiParam {String} password User's password.
 *
 * @apiExample Example :
 *    https://thenicheapp.onrender.com/auth/login
 *
 * @apiSuccess {String} token Authentication token.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "example-token-string"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "User not found"
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Incorrect password"
 *     }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Utilisateur.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }
    // TOKEN DE LOGIN
    const token = jwt.sign(
      {
        user: {
          id: user._id,
          role: user.role,
          nom: user.nom,
          prenom: user.prenom,
          username: user.username,
          ville: user.ville,
          adresse: user.adresse,
          npa: user.npa,
        },
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    //   res.json({ token });
    // } catch (err) {
    //   res.status(500).json({ message: err.message });
    // }

    // retourne tableau avec donnée de l'utilisateur
    const userInfos = {
      id: user._id,
      role: user.role,
      nom: user.nom,
      prenom: user.prenom,
      username: user.username,
      email: user.email,
      ville: user.ville,
      adresse: user.adresse,
      npa: user.npa,
    };

    res.status(200).json({ token, userInfos });
  } catch (error) {
    console.error("Erreur :", error);
    res.status(500).json({ message: error.message });
  }
});

// ROUTE DECONNEXION
/**
 * @api {post} /auth/logout Déconnecter un utilisateur
 * @apiGroup Authentification
 * @apiPermission user, admin
 *
 * @apiExample Example :
 *    https://thenicheapp.onrender.com/auth/logout
 *
 * @apiSuccess {String} message Logout success message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Vous êtes déconnecté"
 *     }
 */
router.post("/logout", (req, res) => {
  try {
    // Vous pouvez également ajouter des vérifications supplémentaires ici,
    // par exemple, vérifier si le token est présent dans la requête.

    // Effacer le token côté client (par exemple, avec des cookies ou en utilisant
    // l'en-tête Authorization)
    // Exemple pour les cookies :
    res.clearCookie("token");

    // Réponse réussie
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    console.error("Erreur :", error);
    res.status(500).json({ message: "Erreur lors de la déconnexion" });
  }
});

export default router;
