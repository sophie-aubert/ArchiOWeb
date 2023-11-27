import supertest from "supertest";
import app from "../app.js"; // Assurez-vous que le chemin est correct
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
      .delete("/annonces/6553747d54fdd5d8fd3dd3db")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).to.equal(200);
  });
});
