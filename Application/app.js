// App.js (Fichier principal de l'application)
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/usersRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Connexion à MongoDB avec Mongoose
mongoose.connect("mongodb://localhost/your-app-name", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

// Utilisation des routes
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// import express from "express";
// import createError from "http-errors";
// import logger from "morgan";
// import indexRouter from "./index.js";
// import usersRouter from "./routes/users.js";
// import mongoose from "mongoose";
// mongoose.connect(
//   process.env.DATABASE_URL || "mongodb://localhost/your-app-name"
// );

// const app = express();

// app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// app.use("/", indexRouter);
// app.use("/users", usersRouter);

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // Send the error status
//   res.status(err.status || 500);
//   res.send(err.message);
// });

// export default app;
