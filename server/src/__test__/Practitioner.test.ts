import request from "supertest";
import { app } from "../index";
import mockData from "./mockData/index.json";
import path from "path";
import { Practitioner } from "prisma/prisma-client";

describe("Testing Practitioner", () => {
  describe("Given User is not Authenticated", () => {
    it("Should not Get Practitioner Data", async () => {
      const res = await request(app).get("/practitioner");
      expect(res.status).toBe(401);
    });
    it("Should not Get Single Practitioner Data", async () => {
      const res = await request(app).get("/practitioner/1");
      expect(res.status).toBe(401);
    });
    it("Should not Create New Practitioner", async () => {
      const res = await request(app).post("/practitioner");
      expect(res.status).toBe(401);
    });
    it("Should not Update Practitioner", async () => {
      const res = await request(app).put("/practitioner/1");
      expect(res.status).toBe(401);
    });
    it("Should not Delete Practitioner", async () => {
      const res = await request(app).delete("/practitioner/1");
      expect(res.status).toBe(401);
    });
  });
  let token = "";
  let practitionerIdToDelete = -1;
  let practitionerIdNotToDelete = -1;

  let otherUserToken = "";
  async function CreatePractitioner(token: string) {
    const practitioner = mockData.practitioner;
    practitioner.email += Date.now();
    practitioner.contact += Math.floor(Math.random() * 1000000000);
    const imgPath = path.join(
      __dirname,
      "mockData",
      "image",
      "practitioner.png"
    );
    const practitionerResponse = await request(app)
      .post("/practitioner")
      .attach("image", imgPath)
      .field("fullname", practitioner.fullname)
      .field("email", practitioner.email)
      .field("contact", practitioner.contact)
      .field("address", practitioner.address)
      .field("dob", practitioner.dob)
      .field("icuSpecialist", practitioner.icuSpecialist)
      .field("startTime", practitioner.startTime)
      .field("endTime", practitioner.endTime)
      .field("Specializations[0][id]", practitioner.Specializations[0].id)
      .field("Specializations[0][name]", practitioner.Specializations[0].name)
      .field("Specializations[1][id]", practitioner.Specializations[1].id)
      .field("Specializations[1][name]", practitioner.Specializations[1].name)
      .field("WorkingDays[0][id]", practitioner.WorkingDays[0].id)
      .field("WorkingDays[0][day]", practitioner.WorkingDays[0].day)
      .field("WorkingDays[1][id]", practitioner.WorkingDays[1].id)
      .field("WorkingDays[1][day]", practitioner.WorkingDays[1].day)
      .set("authorization", token);
    return {
      ...(practitionerResponse.status === 201 && {
        id: practitionerResponse.body.data.id,
      }),
      status: practitionerResponse.status,
    };
  }

  beforeAll(async function () {
    const authResponse = await request(app)
      .post("/signin")
      .send({
        email: "suparthnarayan@ghimire.com",
        password: "suparth123",
      })
      .set("Accept", "application/json");

    const authResponse2 = await request(app)
      .post("/signin")
      .send({
        email: "suparthnarayannew@ghimire.com",
        password: "suparth123",
      })
      .set("Accept", "application/json");

    token = authResponse.body.data.accessToken;
    otherUserToken = authResponse2.body.data.accessToken;
    const practitioner = await CreatePractitioner(token);
    practitionerIdNotToDelete = practitioner.id;
  });
  describe("Given User is Authenticated", () => {
    let allPractitioners: Practitioner[] = [];
    describe("When Request Body and URL Params are Valid", () => {
      it("Should Get Practitioner Data", async () => {
        const res = await request(app)
          .get("/practitioner")
          .set("authorization", token);
        allPractitioners = res.body.data;
        expect(res.status).toBe(200);
      });
      it("Should Order Practitioner Data by Practitioners who are ICU Specialist first", () => {
        let status = true;
        for (let i = 0; i < allPractitioners.length; i++) {
          let nextPractitioner = allPractitioners[i + 1];
          if (nextPractitioner) {
            if (
              nextPractitioner.icuSpecialist === true &&
              allPractitioners[i].icuSpecialist === false
            ) {
              status = false;
              break;
            }
          }
        }
        expect(status).toBe(true);
      });
      it("Should Create New Practitioner", async () => {
        const createdPractitioner = await CreatePractitioner(token);
        practitionerIdToDelete = createdPractitioner.id;
        expect(createdPractitioner.status).toBe(201);
      });
      it("Should Show Single Practitioner", async () => {
        const res = await request(app)
          .get(`/practitioner/${practitionerIdToDelete}`)
          .set("authorization", token);

        expect(res.status).toBe(200);
      });
      it("Should Update Practitioner", async () => {
        const practitioner = mockData.practitioner;
        practitioner.email += Date.now();
        practitioner.contact += Math.floor(Math.random() * 1000000000);
        const imgPath = path.join(
          __dirname,
          "mockData",
          "image",
          "practitioner.png"
        );
        const res = await request(app)
          .put(`/practitioner/${practitionerIdToDelete}`)
          .attach("image", imgPath)
          .field("fullname", practitioner.fullname)
          .field("email", practitioner.email)
          .field("contact", practitioner.contact)
          .field("address", practitioner.address)
          .field("dob", practitioner.dob)
          .field("icuSpecialist", practitioner.icuSpecialist)
          .field("startTime", practitioner.startTime)
          .field("endTime", practitioner.endTime)
          .field("Specialization[0][id]", practitioner.Specializations[0].id)
          .field(
            "Specialization[0][name]",
            practitioner.Specializations[0].name
          )
          .field("Specialization[1][id]", practitioner.Specializations[1].id)
          .field(
            "Specialization[1][name]",
            practitioner.Specializations[1].name
          )
          .field("WorkingDays[0][id]", practitioner.WorkingDays[0].id)
          .field("WorkingDays[0][day]", practitioner.WorkingDays[0].day)
          .field("WorkingDays[1][id]", practitioner.WorkingDays[1].id)
          .field("WorkingDays[1][day]", practitioner.WorkingDays[1].day)
          .set("authorization", token);
        expect(res.status).toBe(201);
      });
      it("Should Delete Practitioner", async () => {
        const res = await request(app)
          .delete(`/practitioner/${practitionerIdToDelete}`)
          .set("authorization", token);

        expect(res.status).toBe(201);
      });
    });
    describe("When Request Body and URL Params are Invalid", () => {
      it("Should Not Create New Practitioner and Return Form Validation Error", async () => {
        const res = await request(app)
          .post("/practitioner")
          .field("icuSpecialist", "")
          .field("startTime", "")
          .field("endTime", "")
          .set("authorization", token);
        expect(res.status).toBe(422);
      });
      it("Should Not Show Single Practitioner and Return Validation Error", async () => {
        const res = await request(app)
          .get(`/practitioner/invalid_parameter`)
          .set("authorization", token);
        expect(res.status).toBe(422);
      });
      it("Should Not Update Practitioner and Return Form Validation Error (Invalid Request Body)", async () => {
        const res = await request(app)
          .put(`/practitioner/${practitionerIdNotToDelete}`)
          .field("email", "invalid_email")
          .set("authorization", token);
        expect(res.status).toBe(422);
      });
      it("Should Not Update Practitioner and Return Validation Error (URL Param)", async () => {
        const res = await request(app)
          .put(`/practitioner/invalid_parameter`)
          .field("startTime", "")
          .field("endTime", "")
          .set("authorization", token);
        expect(res.status).toBe(422);
      });
      it("Should Not Delete Practitioner and Return Validation Error", async () => {
        const res = await request(app)
          .delete(`/practitioner/invalid_parameter`)
          .set("authorization", token);
        expect(res.status).toBe(422);
      });
    });
    describe("When Parameters have value that doesn't exist in Database", () => {
      it("Should Not Show Single Practitioner and Return Not Found Error", async () => {
        const res = await request(app)
          .get(`/practitioner/100000000000`)
          .set("authorization", token);
        expect(res.status).toBe(404);
      });
      it("Should Not Update Practitioner and Return Not Found Error", async () => {
        const res = await request(app)
          .put(`/practitioner/100000000000`)
          .field("startTime", "")
          .field("endTime", "")
          .set("authorization", token);
        expect(res.status).toBe(404);
      });
      it("Should Not Delete Practitioner and Return Not Found", async () => {
        const res = await request(app)
          .delete(`/practitioner/100000000000`)
          .set("authorization", token);
        expect(res.status).toBe(404);
      });
    });
    describe("When User Deletes Practitioner that was created by Other User", () => {
      it("Should Not Delete Practitioner and Return Forbidden Error", async () => {
        const res = await request(app)
          .delete(`/practitioner/${practitionerIdNotToDelete}`)
          .set("authorization", otherUserToken);
        expect(res.status).toBe(403);
      });
    });
    describe("When User Updates Practitioner that was created by Other User", () => {
      it("Should Not Update Practitioner and Return Forbidden Error", async () => {
        const res = await request(app)
          .put(`/practitioner/${practitionerIdNotToDelete}`)
          .set("authorization", otherUserToken);
        expect(res.status).toBe(403);
      });
    });
  });
  afterAll(async function () {
    await request(app).delete("/signout");
  });
});
