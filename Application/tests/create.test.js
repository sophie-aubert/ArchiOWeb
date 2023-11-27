import supertest from "supertest";
import app from "../app.js";
import { expect } from "chai";

describe("Create Operation Tests", () => {
  it("should create a new object", async () => {
    // Authentification en tant qu'admin
    const authResponse = await supertest(app).post("/auth/login").send({
      email: "TheAdmin@admin.com",
      password: "admin",
    });
    const authToken = authResponse.body.token;

    // Envoi de la requête de création avec le token d'authentification
    const response = await supertest(app)
      .post("/annonces")
      .set("Authorization", `${authToken}`)
      .send({
        titre: "Annonce TEST",
        description: "Cette annonce a été créée pour les tests",
        prix: 99.99,
        categorie: "Vestes",
        latitude: 12.34,
        longitude: 56.78,
      });

    console.log(response.body);
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("_id");
  });
});
