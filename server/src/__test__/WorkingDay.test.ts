import request from "supertest";
import { app } from "../index";

describe("WorkingDay Test", () => {
  describe("Given that user is not Authenticated", () => {
    it("Should not Get Working Days", async () => {
      const res = await request(app).get("/day");
      expect(res.status).toBe(401);
    });
  });

  let token = "";
  beforeAll(async function () {
    const authResponse = await request(app)
      .post("/signin")
      .send({
        email: "testuser@gmail.com",
        password: "password",
      })
      .set("Accept", "application/json");
    token = authResponse.body.data.accessToken;
  });
  describe("Given that user is Authenticated", () => {
    it("Should Get Working Days", async () => {
      const res = await request(app).get("/day").set("authorization", token);
      expect(res.status).toBe(200);
    });
  });
  afterAll(async function () {
    await request(app).delete("/signout");
  });
});
