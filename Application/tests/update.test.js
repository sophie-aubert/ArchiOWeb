import supertest from "supertest";
import app from "../app.js";
import { expect } from "chai";

describe("Update Operation Tests", () => {
  it("should update an existing object", async () => {
    // Authentification en tant qu'admin
    const authResponse = await supertest(app).post("/auth/login").send({
      email: "TheAdmin@admin.com",
      password: "admin",
    });
    const authToken = authResponse.body.token;

    // Récupération d'une annonce au hasard depuis la base de données
    const annoncesResponse = await supertest(app).get("/annonces");
    const annonces = annoncesResponse.body;
    const annonceAleatoire =
      annonces[Math.floor(Math.random() * annonces.length)];

    // Envoi de la requête de mise à jour avec le token d'authentification
    const response = await supertest(app)
      .put(`/annonces/${annonceAleatoire._id}`)
      .set("Authorization", `${authToken}`)
      .send({
        titre: "Annonce modifiée automatiquement par les tests",
      });

    console.log(response.body);
    expect(response.status).to.equal(200);
  });
});
