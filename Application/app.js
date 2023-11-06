import express from "express";
const router = express();
const port = 3000;

// const userRoutes = "./routes/usersRoutes";
// const authRoutes = "./routes/authRoutes";

// const app = express();

// // Connexion à MongoDB avec Mongoose
// // mongoose.connect(
// //   "mongodb+srv://admin:TheNiche1234@clustertheniche.dzl3a3c.mongodb.net/AppTheNiche?retryWrites=true&w=majority",
// //   {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true,
// //   }
// // );

// app.use(express.json());

// // Utilisation des routes
// app.use("/users", userRoutes);
// app.use("/auth", authRoutes);

router.get("/", function (req, res, next) {
  res.send("Bienvenue sur mon API REST !");
});

router.listen(port, () => {
  console.log(
    `Même les serveurs ont des oreilles ! Celui-là écoute sur le port ${port}`
  );
});
