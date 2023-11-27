import supertest from "supertest";
import app from "../app.js"; // Assurez-vous que le chemin est correct
import { expect } from "chai";

describe("List Operation Tests", () => {
  it("should retrieve a list of objects", async () => {
    const response = await supertest(app).get("/annonces");

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
    // Ajoutez d'autres assertions selon vos besoins
  });
});
