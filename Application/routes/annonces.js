import express from "express";
import multer from "multer";
import Annonce from "../models/annonceModel.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { broadcastMessage } from "../utils/messaging.js";
import { authAnnonceMiddleware } from "../middlewares/authAnnonceMiddleware.js";
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ROUTE POUR RECUPERER TOUTES LES ANNONCES AVEC FILTRES FACULTATIFS ET PAGINATION
/**
 * @api {get} /annonces Lister toutes les annonces avec filtres et pagination
 * @apiName GetAnnonces
 * @apiGroup Annonces
 *
 * @apiExample Example ::
 *     https://thenicheapp.onrender.com/annonces?page=1&limit=10&categorie=Vestes
 *
 * @apiParam {Number} [page=1] Page number for pagination.
 * @apiParam {Number} [limit=10] Number of items per page.
 * @apiParam {String} [categorie] Filter by category.
 * @apiParam {Number} [prixMin] Filter by minimum price.
 * @apiParam {Number} [prixMax] Filter by maximum price.
 *
 * @apiSuccess {Object[]} annonces List of annonces.
 * @apiSuccess {String} annonces.titre Title of the annonce.
 * @apiSuccess {String} annonces.description Description of the annonce.
 * @apiSuccess {Number} annonces.prix Price of the annonce.
 * @apiSuccess {String} annonces.categorie Category of the annonce.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "titre": "Example Title",
 *         "description": "Example Description",
 *         "prix": 20.5,
 *         "categorie": "Vestes"
 *       },
 *       // ...
 *     ]
 */
router.get("/", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    let query = {};

    if (req.query.categorie) {
      query.categorie = req.query.categorie;
    }

    if (req.query.prixMin) {
      query.prix = { $gte: req.query.prixMin };
    }

    if (req.query.prixMax) {
      query.prix = { ...query.prix, $lte: req.query.prixMax };
    }

    const annonces = await Annonce.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(annonces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ROUTE AFFICHAGE ANNONCE PAR ID
/**
 * @api {get} /annonces/:id Afficher une annonce par ID
 * @apiName GetAnnonceById
 * @apiGroup Annonces
 *
 * @apiExample Example :
 *     https://thenicheapp.onrender.com/annonces/65676815812f486515225ddc
 *
 * @apiParam {String} id Annonce's unique ID.
 *
 * @apiSuccess {String} titre Title of the annonce.
 * @apiSuccess {String} description Description of the annonce.
 * @apiSuccess {Number} prix Price of the annonce.
 * @apiSuccess {String} categorie Category of the annonce.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "titre": "Example Title",
 *       "description": "Example Description",
 *       "prix": 20.5,
 *       "categorie": "Chaussures"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Annonce not found"
 *     }
 */
router.get("/:id", async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);
    res.json(annonce);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// *** NOUVEAU ***
// ROUTE POUR LISTER LES ANNONCES D'UN UTILISATEUR
// CONNEXION UTILISATEUR OU ADMIN
/**
 * @api {get} /annonces/mesAnnonces/:id Lister les annonces d'un utilisateur par ID
 * @apiName GetAnnoncesByUser
 * @apiGroup Annonces
 *
 * @apiExample Example :
 *     https://thenicheapp.onrender.com/annonces/mesAnnonces/656767a3812f486515225dd8
 *
 *
 * @apiHeader {String} Authorization User's authorization token.
 *
 * @apiParam {String} id User's unique ID.
 *
 * @apiSuccess {Object[]} annonces List of annonces created by the user.
 * @apiSuccess {String} annonces.titre Title of the annonce.
 * @apiSuccess {String} annonces.description Description of the annonce.
 * @apiSuccess {Number} annonces.prix Price of the annonce.
 * @apiSuccess {String} annonces.categorie Category of the annonce.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "titre": "Example Title",
 *         "description": "Example Description",
 *         "prix": 20.5,
 *         "categorie": "Shoes"
 *       },
 *       // ... (other annonces created by the user)
 *     ]
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "User not found"
 *     }
 */
router.get("/mesAnnonces/:id", authMiddleware, async (req, res) => {
  try {
    const annonces = await Annonce.find({
      utilisateur: req.params.id,
    });
    res.json(annonces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ROUTE POUR CREER UNE ANNONCE
// CONNEXION UTILISATEUR OU ADMIN
/**
 * @api {post} /annonces Ajouter une nouvelle annonce
 * @apiName CreateAnnonce
 * @apiGroup Annonces
 *
 * @apiExample Example :
 *     https://thenicheapp.onrender.com/annonces
 *
 *
 *
 * @apiHeader {String} Authorization User's authorization token.
 *
 *
 * @apiParam {String} titre Title of the annonce.
 * @apiParam {String} description Description of the annonce.
 * @apiParam {Number} prix Price of the annonce.
 * @apiParam {String} categorie Category of the annonce.
 * @apiParam {Number} latitude Latitude for geolocation.
 * @apiParam {Number} longitude Longitude for geolocation.
 * @apiParam {File} image Image file for the annonce.
 *
 * @apiSuccess {String} titre Title of the created annonce.
 * @apiSuccess {String} description Description of the created annonce.
 * @apiSuccess {Number} prix Price of the created annonce.
 * @apiSuccess {String} categorie Category of the created annonce.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "titre": "Example Title",
 *       "description": "Example Description",
 *       "prix": 20.5,
 *       "categorie": "Shoes"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Invalid input data"
 *     }
 */
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { titre, description, prix, categorie, latitude, longitude } =
      req.body;

    // Accédez à l'ID de l'utilisateur à partir du token dans le middleware d'authentification
    const utilisateur = req.user.id;

    const newAnnonce = new Annonce({
      titre,
      description,
      prix,
      utilisateur,
      categorie,
      geolocation: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });

    if (req.file) {
      newAnnonce.image = req.file.buffer;
    }

    const savedAnnonce = await newAnnonce.save();

    broadcastMessage("new_announcement", savedAnnonce);
    broadcastMessage("illustrative_message", {
      message: "This is an illustrative message.",
    });

    res.status(201).json(savedAnnonce);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ROUTE MIS A JOUR ANNONCE
// CONNECION UTILISATEUR OU ADMIN
/**
 * @api {put} /annonces/:id Modifier une annonce par ID
 * @apiName UpdateAnnonce
 * @apiGroup Annonces
 *
 * @apiExample Example :
 *     https://thenicheapp.onrender.com/annonces/65676815812f486515225ddc
 *
 * @apiHeader {String} Authorization User's authorization token.
 *
 * @apiParam {String} [titre] New title for the annonce.
 * @apiParam {String} [description] New description for the annonce.
 * @apiParam {Number} [prix] New price for the annonce.
 * @apiParam {String} [imageUrl] New image URL for the annonce.
 *
 * @apiSuccess {String} titre Updated title of the annonce.
 * @apiSuccess {String} description Updated description of the annonce.
 * @apiSuccess {Number} prix Updated price of the annonce.
 * @apiSuccess {String} imageUrl Updated image URL of the annonce.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "titre": "Updated Title",
 *       "description": "Updated Description",
 *       "prix": 25.5,
 *       "imageUrl": "http://example.com/updated-image.jpg"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Annonce not found"
 *     }
 */
router.put("/:id", authAnnonceMiddleware, async (req, res) => {
  try {
    const annonceId = req.params.id;
    const { titre, description, prix, imageUrl } = req.body;
    const annonce = await Annonce.findById(annonceId);
    if (!annonce) {
      return res.status(404).json({ message: "Annonce non trouvée" });
    }
    annonce.titre = titre || annonce.titre;
    annonce.description = description || annonce.description;
    annonce.prix = prix || annonce.prix;
    annonce.imageUrl = imageUrl || annonce.imageUrl;
    const updatedAnnonce = await annonce.save();
    res.json(updatedAnnonce);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ROUTE SUPPRESSION ANNONCE
// CONNEXION UTILISATEUR OU ADMIN

/**
 * @api {delete} /annonces/:id Supprimer une annonce par ID
 * @apiName DeleteAnnonce
 * @apiGroup Annonces
 *
 * @apiExample Example :
 *     https://thenicheapp.onrender.com/annonces/656767a3812f486515225dd8
 *
 * @apiHeader {String} Authorization User's authorization token.
 *
 * @apiParam {String} id Annonce's unique ID.
 *
 * @apiSuccess {String} message Success message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Annonce deleted successfully"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Annonce not found"
 *     }
 */
router.delete("/:id", authAnnonceMiddleware, async (req, res) => {
  try {
    const annonceId = req.params.id;
    const annonce = await Annonce.findById(annonceId);
    if (!annonce) {
      return res.status(404).json({ message: "Annonce non trouvée" });
    }

    if (
      annonce.utilisateur.toString() !== req.user.id &&
      req.user.isAdmin === false
    ) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }
    await Annonce.findByIdAndDelete(annonceId);
    res.json({ message: "Annonce supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
