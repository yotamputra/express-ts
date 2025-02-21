import { logger } from "../src/application/logging";
import { app } from "./../src/application/app";
import { AddressTest, ContactTest, UserTest } from "./test.util";
import supertest from "supertest";

describe("POST /api/contacts/:contactId/addresses", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should create address", async () => {
    const contact = await ContactTest.get();

    const res = await supertest(app)
      .post(`/api/contacts/${contact.id}/addresses`)
      .set("X-API-TOKEN", "test")
      .send({
        street: "test",
        city: "test",
        province: "test",
        country: "test",
        postal_code: "12345",
      });

    logger.debug(res.body);
    expect(res.status).toBe(201);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.street).toBe("test");
    expect(res.body.data.city).toBe("test");
    expect(res.body.data.province).toBe("test");
    expect(res.body.data.country).toBe("test");
    expect(res.body.data.postal_code).toBe("12345");
  });

  it("should reject create address if request is invalid", async () => {
    const contact = await ContactTest.get();

    const res = await supertest(app)
      .post(`/api/contacts/${contact.id}/addresses`)
      .set("X-API-TOKEN", "test")
      .send({
        street: "test",
        city: "test",
        province: "test",
        country: "",
        postal_code: "",
      });

    logger.debug(res.body);
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it("should reject create address if request is contact is not found", async () => {
    const contact = await ContactTest.get();

    const res = await supertest(app)
      .post(`/api/contacts/${contact.id + 1}/addresses`)
      .set("X-API-TOKEN", "test")
      .send({
        street: "test",
        city: "test",
        province: "test",
        country: "test",
        postal_code: "12345",
      });

    logger.debug(res.body);
    expect(res.status).toBe(404);
    expect(res.body.errors).toBeDefined();
  });
});
