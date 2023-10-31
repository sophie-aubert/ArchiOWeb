import express from "express";
const router = express();
const port = 3000;

router.get("/", function (req, res, next) {
  res.send("Bienvenue sur mon API REST !");
});

router.listen(port, () => {
  console.log(
    `Même les serveurs ont des oreilles ! Celui-là écoute sur le port ${port}`
  );
});

export default router;

// boubou
// les louksiloups