import express from "express";
import Transaction from "../models/transactionModel.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

const isAdminMiddleware = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    // L'utilisateur est un administrateur, passez à la suite
    next();
  } else {
    res.status(403).json({
      message:
        "Accès non autorisé. Seuls les administrateurs peuvent accéder à cette ressource.",
    });
  }
};

// ROUTE POUR RECUPERER TOUTES LES TRANSACTIONS
// seulement pour les admins
// Utilisez le middleware isAdminMiddleware pour protéger la route

/**
 * @api {get} /transactions Lister toutes les transactions
 * @apiName GetAllTransactions
 * @apiGroup Transactions
 * @apiPermission admin
 *
 * @apiExample Example :
 *   https://thenicheapp.onrender.com/transactions
 *
 *
 * @apiHeader {String} Authorization User's authorization token.
 *
 * @apiSuccess {Object[]} transactions List of transactions.
 * @apiSuccess {String} transactions._id Transaction ID.
 * @apiSuccess {Object} transactions.annonce Associated announcement.
 * @apiSuccess {Object} transactions.acheteur Buyer information.
 * @apiSuccess {Object} transactions.vendeur Seller information.
 * @apiSuccess {Number} transactions.prix Transaction price.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "_id": "transaction-id",
 *         "annonce": { /* Announcement details *\/ },
 *         "acheteur": { /* Buyer details *\/ },
 *         "vendeur": { /* Seller details *\/ },
 *         "prix": 50.00
 *       },
 *       // ...
 *     ]
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "message": "Access denied. Only administrators can access this resource."
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Internal Server Error"
 *     }
 */

router.get("/", authMiddleware, isAdminMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("annonce acheteur");
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @api {post} /transactions Créer une nouvelle transaction
 * @apiName CreateTransaction
 * @apiGroup Transactions
 *
 *  * @apiExample Example :
 *   https://thenicheapp.onrender.com/transactions
 *
 * @apiParam {String} annonce Announcement ID.
 * @apiParam {Number} prix Transaction price.
 * @apiParam {String} acheteur Buyer ID.
 * @apiParam {String} vendeur Seller ID.
 *
 * @apiSuccess {String} _id Transaction ID.
 * @apiSuccess {String} annonce Associated announcement ID.
 * @apiSuccess {String} acheteur Buyer ID.
 * @apiSuccess {String} vendeur Seller ID.
 * @apiSuccess {Number} prix Transaction price.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "_id": "transaction-id",
 *       "annonce": "announcement-id",
 *       "acheteur": "buyer-id",
 *       "vendeur": "seller-id",
 *       "prix": 50.00
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "The announcement is already associated with a transaction."
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Internal Server Error"
 *     }
 */

router.post("/", async (req, res) => {
  try {
    const { annonce, prix, acheteur, vendeur } = req.body;

    // Vérifier si l'ID de l'annonce est déjà utilisé dans une autre transaction
    const existingTransaction = await Transaction.findOne({ annonce });

    if (existingTransaction) {
      return res
        .status(400)
        .json({ message: "L'annonce est déjà associée à une transaction." });
    }

    // Si l'ID de l'annonce n'est pas utilisé, créer la nouvelle transaction
    const nouvelleTransaction = new Transaction({
      annonce,
      prix,
      acheteur,
      vendeur,
    });

    const transaction = await nouvelleTransaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ROUTE POUR LISTER LES TRANSACTIONS D'UN UTILISATEUR
// CONNEXION UTILISATEUR OU ADMIN

/**
 * @api {get} /transactions/mesTransactions/:id Lister des transactions d'un utilisateur
 * @apiName GetUserTransactions
 * @apiGroup Transactions
 * @apiPermission user, admin
 *
 *  * @apiExample Example :
 *   https://thenicheapp.onrender.com/transactions/mesTransactions/656767a3812f486515225dd8
 *
 *
 * @apiParam {String} id User ID.
 *
 * @apiSuccess {Object[]} transactions List of transactions.
 * @apiSuccess {String} transactions._id Transaction ID.
 * @apiSuccess {Object} transactions.annonce Associated announcement.
 * @apiSuccess {Object} transactions.acheteur Buyer information.
 * @apiSuccess {Object} transactions.vendeur Seller information.
 * @apiSuccess {Number} transactions.prix Transaction price.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "_id": "transaction-id",
 *         "annonce": { /* Announcement details *\/ },
 *         "acheteur": { /* Buyer details *\/ },
 *         "vendeur": { /* Seller details *\/ },
 *         "prix": 50.00
 *       },
 *       // ... other transactions
 *     ]
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Internal Server Error"
 *     }
 */
router.get("/mesTransactions/:id", async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ acheteur: req.params.id }, { vendeur: req.params.id }],
    }).populate("annonce acheteur vendeur");
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
