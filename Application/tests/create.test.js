import supertest from "supertest";
import app from "../app.js";
import { expect } from "chai";

describe("Create Operation Tests", () => {
  it("should create a new object", async () => {
    const response = await supertest(app).post("/annonces").send({
      titre: "Annonce TEST",
      description: "Cette annonce à été créée pour les tests",
      utilisateur: "654cdf45e16f0cbe281f8652",
      categorie: "Vestes",
      latitude: 12.34,
      longitude: 56.78,
    });

    console.log(response.body);
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("_id");
  });
});
