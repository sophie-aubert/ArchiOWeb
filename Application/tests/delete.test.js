import supertest from "supertest";
import app from "../app.js";
import { expect } from "chai";

describe("Delete Operation Tests", () => {
  it("Suppression d'une annonce", async () => {
    const authResponse = await supertest(app).post("/auth/login").send({
      email: "TheAdmin@admin.com",
      password: "admin",
    });
    const authToken = authResponse.body.token;
    //console.log(authToken);

    // Annonce au hasard prise dans la base de données
    const responseGet = await supertest(app).get("/annonces");
    const annonce = responseGet.body[0];

    const response = await supertest(app)
      .delete(`/annonces/${annonce._id}`)
      .set("Authorization", `${authToken}`);

    console.log(response.body);
    expect(response.status).to.equal(200);
  });
});
