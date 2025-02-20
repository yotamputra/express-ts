import supertest from "supertest";
import { app } from "./../src/application/app";
import { logger } from "../src/application/logging";
import { ContactTest, UserTest } from "./test.util";

describe("POST /api/contacts", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should create a contact", async () => {
    const response = await supertest(app)
      .post("/api/contacts")
      .set("X-API-TOKEN", "test")
      .send({
        first_name: "test",
        last_name: "test",
        email: "test@mail.com",
        phone: "1234567890",
      });

    logger.debug(response.body);
    expect(response.status).toBe(201);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.first_name).toBe("test");
    expect(response.body.data.last_name).toBe("test");
    expect(response.body.data.email).toBe("test@mail.com");
    expect(response.body.data.phone).toBe("1234567890");
  });
});
