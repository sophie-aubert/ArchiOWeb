// import express from "express";
// const router = express.Router();

// router.get("/", function (req, res, next) {
//   res.send("Got a response from the users route");
// });

// export default router;

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
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
});

const User = mongoose.model("User", userSchema);

module.exports = User;
