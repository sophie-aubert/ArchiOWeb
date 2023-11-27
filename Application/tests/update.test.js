import supertest from "supertest";
import app from "../app.js"; // Assurez-vous que le chemin est correct
import { expect } from "chai";

// On lui dit qu'on est connecté en tant que admin
app.use((req, res, next) => {
  req.user = { role: "admin" };
  next();
});

describe("Update Operation Tests", () => {
  it("should update an existing object", async () => {
    const response = await supertest(app)
      .put("/annonces/6554bfe00e60eaa1baf8290b")
      .send({
        titre: "Nouveau Titre",
        description: "Nouvelle Description",
        imageUrl: "nouvelle_url_image",
      });

    expect(response.status).to.equal(200);
    // Ajoutez d'autres assertions selon vos besoins
  });
});
