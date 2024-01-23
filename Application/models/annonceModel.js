import mongoose from "mongoose";

const categorieEnum = [
  "Chaussures",
  "Pantalons",
  "Chemises",
  "Pulls",
  "Vestes",
  "Manteaux",
  "Accessoires",
  "T-shirts",
];

const annonceSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    prix: {
      type: Number,
      required: true,
    },
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utilisateur",
      required: true,
    },
    categorie: {
      type: String,
      required: true,
      enum: categorieEnum,
    },
    // geolocation: {
    //   type: {
    //     type: String,
    //     default: "Point",
    //   },
    //   coordinates: {
    //     type: [Number],
    //     required: true,
    //     validate: {
    //       validator: validateGeoJsonCoordinates,
    //       message:
    //         "{VALUE} is not a valid longitude/latitude(/altitude) coordinates array",
    //     },
    //   },
    // },
    image: {
      type: Buffer,
      required: false,
    },

    status: {
      type: String,
      enum: ["En ligne", "Acheté", "Vendu"],
      default: "En ligne",
    },

    localisation: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

annonceSchema.index({ geolocation: "2dsphere" });

const Annonce = mongoose.model("Annonce", annonceSchema);

function validateGeoJsonCoordinates(value) {
  return (
    Array.isArray(value) &&
    value.length >= 2 &&
    value.length <= 3 &&
    isLongitude(value[0]) &&
    isLatitude(value[1])
  );
}

function isLatitude(value) {
  return value >= -90 && value <= 90;
}

function isLongitude(value) {
  return value >= -180 && value <= 180;
}

export default Annonce;
