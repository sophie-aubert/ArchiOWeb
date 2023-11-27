import supertest from "supertest";
import app from "../app.js";
import { expect } from "chai";

describe("Delete Operation Tests", () => {
  it("should delete an existing object", async () => {
    const authResponse = await supertest(app).post("/auth").send({
      email: "TheAdmin@admin.com",
      password: "admin",
    });

    // Récupérez le jeton d'authentification du corps de la réponse
    const authToken = authResponse.body.token;

    // Effectuez la demande de suppression avec le jeton d'authentification
    const response = await supertest(app)
      .set("Authorization", `Bearer ${authToken}`)
      .delete("/annonces/6553747d54fdd5d8fd3dd3db");

    expect(response.status).to.equal(200);
  });
});
