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

///////////////////////////////////////////////////
// BASE DE DONNÉES
//////////////////////////////////////////////////

export default router;

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://admin:TheNiche1234@clustertheniche.dzl3a3c.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

//////////////////////////////////////////////////////////////////////////////////////
