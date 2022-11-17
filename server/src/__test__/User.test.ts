import request from "supertest";
import { app } from "../index";
import mockData from "./mockData/index.json";

describe("Testing User", () => {
  const newUserEmail = mockData.user.email + Date.now();
  async function CreateUser(email = newUserEmail) {
    const signupResponse = await request(app)
      .post("/signup")
      .send({
        name: mockData.user.name,
        email: email,
        password: mockData.user.password,
        confirmPassword: mockData.user.confirmPassword,
      })
      .set("Content-Type", "application/json");
    return signupResponse;
  }
  let accessToken = "";
  let refreshToken = "";
  beforeAll(async () => {
    await CreateUser();
    const authResponse = await request(app)
      .post("/signin")
      .send({
        email: newUserEmail,
        password: mockData.user.password,
      })
      .set("Accept", "application/json");
    accessToken = authResponse.body.data.accessToken;
    refreshToken = authResponse.body.data.refreshToken;
  });

  describe("Given User is Authenticated", () => {
    it("Should Get User Data", async () => {
      const res = await request(app).get("/").set("authorization", accessToken);
      expect(res.status).toBe(200);
    });

    it("Should Be able to Refresh Token", async () => {
      const res = await request(app)
        .post("/refresh")
        .set("authorization", refreshToken);
      expect(res.status).toBe(201);
    });

    it("Should Not Be able to Sign Up", async () => {
      const res = await request(app)
        .post("/signup")
        .set("authorization", accessToken);
      expect(res.status).toBe(403);
    });
    it("Should Not Be able to Sign In", async () => {
      const res = await request(app)
        .post("/signin")
        .set("authorization", refreshToken);
      expect(res.status).toBe(403);
    });
    it("Should Be able to Signout", async () => {
      const res = await request(app)
        .delete("/signout")
        .set("authorization", accessToken);
      expect(res.status).toBe(201);
    });
  });

  describe("Given User is not Authenticated", () => {
    it("Should Not Get User Data", async () => {
      const res = await request(app).get("/").set("authorization", "");
      expect(res.status).toBe(401);
    });
    it("Should Not Be able to Signout", async () => {
      const res = await request(app).delete("/signout");
      expect(res.status).toBe(401);
    });
    it("Should Not Be able to Refresh Token", async () => {
      const res = await request(app).post("/refresh");
      expect(res.status).toBe(401);
    });
    it("Should Be able to Sign Up", async () => {
      const res = await CreateUser(newUserEmail + "1");
      expect(res.status).toBe(201);
    });
  });
});
