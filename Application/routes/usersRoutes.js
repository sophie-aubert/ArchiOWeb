import express from "express";
import Utilisateur from "../models/utilisateurModel.js";
import Annonce from "../models/annonceModel.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const router = express.Router();

// RECUPERER TOUS LES UTILISATEURS

/**
 * @api {get} /utilisateurs Lister de tous les utilisateurs
 * @apiName GetAllUsers
 * @apiGroup Utilisateurs
 *
 *  * @apiExample Example :
 *   https://thenicheapp.onrender.com/utilisateurs
 *
 *
 * @apiSuccess {Object[]} users List of users.
 * @apiSuccess {String} users._id User ID.
 * @apiSuccess {String} users.username Username.
 * @apiSuccess {String} users.email User email.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "_id": "user-id",
 *         "username": "john_doe",
 *         "email": "john.doe@example.com"
 *       },
 *       // ... other users
 *     ]
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Internal Server Error"
 *     }
 */

router.get("/", async (req, res) => {
  try {
    const users = await Utilisateur.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// RECUPERER UN UTILISATEUR AVEC ID

/**
 * @api {get} /utilisateurs/:id Récupérer un utilisateur par ID
 * @apiName GetUserById
 * @apiGroup Utilisateurs
 *
 *  @apiExample Example :
 *   https://thenicheapp.onrender.com/utilisateurs/656767a3812f486515225dd8
 *
 * @apiParam {String} id User ID.
 *
 * @apiSuccess {String} _id User ID.
 * @apiSuccess {String} username Username.
 * @apiSuccess {String} email User email.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "user-id",
 *       "username": "john_doe",
 *       "email": "john.doe@example.com"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Internal Server Error"
 *     }
 */
router.get("/:id", async (req, res) => {
  try {
    const user = await Utilisateur.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ROUTE MISE A JOUR UTILISATEUR
// CONNEXION UTILISATEUR OU ADMIN

/**
 * @api {put} /utilisateurs/:id Mettre à jour un utilisateur par ID
 * @apiName UpdateUser
 * @apiGroup Utilisateurs
 * @apiPermission user, admin
 *
 * @apiExample Example :
 *   https://thenicheapp.onrender.com/utilisateurs/656767a3812f486515225dd8
 *
 * @apiHeader {String} Authorization User's authorization token.
 *
 * @apiParam {String} id User ID.
 * @apiParam {String} [username] New username.
 * @apiParam {String} [email] New user email.
 * @apiParam {String} [password] New user password.
 *
 * @apiSuccess {String} _id User ID.
 * @apiSuccess {String} username Updated username.
 * @apiSuccess {String} email Updated user email.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "user-id",
 *       "username": "new_john_doe",
 *       "email": "new_john.doe@example.com"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "message": "Access denied. You are not authorized to access this resource."
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "User not found"
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Internal Server Error"
 *     }
 */

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    const requestingUserId = req.user.id;

    if (req.user.isAdmin || userId === requestingUserId) {
      let updateFields = {};
      const { nom, prenom, username, email, password, ville, adresse, npa } =
        req.body;

      // Ne mettez à jour le mot de passe que s'il est fourni
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateFields = {
          nom,
          prenom,
          username,
          email,
          password: hashedPassword,
          ville,
          adresse,
          npa,
        };
      } else {
        updateFields = { nom, prenom, username, email, ville, adresse, npa };
      }

      const updatedUser = await Utilisateur.findByIdAndUpdate(
        userId,
        updateFields,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      res.json(updatedUser);
    } else {
      res.status(403).json({ message: "Accès non autorisé" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ROUTE SUPPRESSION
// CONNEXION UTILISATEUR OU ADMIN

/**
 * @api {delete} /utilisateurs/:id Supprimer un utilisateur par ID
 * @apiName DeleteUser
 * @apiGroup Utilisateurs
 * @apiPermission user, admin

 *
 *  *  @apiExample Example :
 *   https://thenicheapp.onrender.com/utilisateurs/656767a3812f486515225dd8
 *
 * @apiHeader {String} Authorization User's authorization token.
 *
 * @apiParam {String} id User ID.
 *
 * @apiSuccess {String} message Deletion success message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "User deleted successfully"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "message": "Access denied. You are not authorized to access this resource."
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "User not found"
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Internal Server Error"
 *     }
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    const requestingUserId = req.user.id;

    if (req.user.isAdmin || userId === requestingUserId) {
      const deletedUser = await Utilisateur.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      res.json({ message: "Utilisateur supprimé avec succès" });
    } else {
      res.status(403).json({ message: "Désolé ... Accès non autorisé" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ROUTE NOMBRE D'ANNONCES D'UN UTILISATEUR
/**
 * @api {get} /utilisateurs/:id/nombre-annonces Récupérer le nombre d'annonces d'un utilisateur
 * @apiName GetNumberOfAnnouncementsByUser
 * @apiGroup Utilisateurs
 *
 *  @apiExample Example :
 *   https://thenicheapp.onrender.com/utilisateurs/656767a3812f486515225dd8/nombre-annonces
 *
 * @apiParam {String} id User ID.
 *
 * @apiSuccess {String} userId User ID.
 * @apiSuccess {Number} nombreAnnonces Number of announcements.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "userId": "user-id",
 *       "nombreAnnonces": 5
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "User not found"
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Internal Server Error"
 *     }
 */
router.get("/:id/nombre-annonces", async (req, res) => {
  try {
    const userId = req.params.id;

    // Vérifiez si l'utilisateur existe
    const user = await Utilisateur.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Comptez le nombre d'annonces pour cet utilisateur en utilisant un pipeline d'agrégation
    const pipeline = [
      {
        $match: {
          utilisateur: mongoose.Types.ObjectId.createFromHexString(userId),
        },
      },
      { $group: { _id: null, nombreAnnonces: { $sum: 1 } } },
    ];

    const result = await Annonce.aggregate(pipeline);

    // Renvoyer le résultat
    res.status(200).json({
      userId,
      nombreAnnonces: result.length > 0 ? result[0].nombreAnnonces : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
