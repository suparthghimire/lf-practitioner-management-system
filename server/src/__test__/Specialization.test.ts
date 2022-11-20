import request from "supertest";
import { app } from "../index";

describe("Specialization Test", () => {
  describe("Given that User is not Authenticated", () => {
    it("Should not Get Specializations", async () => {
      const res = await request(app).get("/specialization");
      expect(res.status).toBe(401);
    });
  });

  let token = "";
  beforeAll(async function () {
    const authResponse = await request(app)
      .post("/signin")
      .send({
        email: "suparthnarayan@ghimire.com",
        password: "suparth123",
      })
      .set("Accept", "application/json");
    token = authResponse.body.data.accessToken;
  });
  describe("Given that user is Authenticated", () => {
    it("Should Get Specializations", async () => {
      const res = await request(app)
        .get("/specialization")
        .set("authorization", token);
      expect(res.status).toBe(200);
    });
  });
  afterAll(async function () {
    await request(app).delete("/signout");
  });
});
