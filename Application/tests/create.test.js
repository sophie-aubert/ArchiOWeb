import supertest from "supertest";
import app from "../app.js"; // Assurez-vous que le chemin est correct
import { expect } from "chai";

describe("Create Operation Tests", () => {
  it("should create a new object", async () => {
    const response = await supertest(app).post("/annonces").send({
      titre: "Nouvelle Annonce TEST",
      description: "Description de la nouvelle annonce",
      utilisateur: "654cdf45e16f0cbe281f8652",
      categorie: "Vestes",
      latitude: 12.34,
      longitude: 56.78,
    });

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("_id");
    // Ajoutez d'autres assertions selon vos besoins
  });
});
