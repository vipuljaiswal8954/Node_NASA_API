const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test/ Get Launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect("content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test/ Post Launches", () => {
    const completeLaunchData = {
      mission: "Vipul",
      rocket: "Target",
      target: "Kepler-442 b",
      launchDate: "January 4, 2028",
    };

    const launchDataWithoutDate = {
      mission: "Vipul",
      rocket: "Target",
      target: "Kepler-442 b",
    };

    test("It should respond with 201 success", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);

      expect(response.body).toMatchObject(launchDataWithoutDate);
    });
    test("It should catch missing required properties", () => {});
    test("It should catch invalid Date", () => {});
  });
});
