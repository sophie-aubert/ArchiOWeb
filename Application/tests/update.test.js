import supertest from "supertest";
import app from "../app.js";
import { expect } from "chai";

describe("Update Operation Tests", () => {
  it("should update an existing object", async () => {
    const authResponse = await supertest(app).post("/auth/login").send({
      email: "TheAdmin@admin.com",
      password: "admin",
    });
    const authToken = authResponse.body.token;
    // console.log(authToken);

    const response = await supertest(app)
      .put("/annonces/65649339254870eaac0e2150")
      .set("Authorization", `${authToken}`)
      .send({
        titre: "Annonce modifiée automatiquement par les tests",
      });

    console.log(response.body);
    expect(response.status).to.equal(200);
  });
});
