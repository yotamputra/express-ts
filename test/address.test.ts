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

describe("GET /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
    await AddressTest.create();
  });

  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should get address", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();

    const res = await supertest(app)
      .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("X-API-TOKEN", "test");

    logger.debug(res.body);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.street).toBe(address.street);
    expect(res.body.data.city).toBe(address.city);
    expect(res.body.data.province).toBe(address.province);
    expect(res.body.data.country).toBe(address.country);
    expect(res.body.data.postal_code).toBe(address.postal_code);
  });

  it("should reject get address if address is not found", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();

    const res = await supertest(app)
      .get(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
      .set("X-API-TOKEN", "test");

    logger.debug(res.body);
    expect(res.status).toBe(404);
    expect(res.body.errors).toBeDefined();
  });

  it("should reject get address if contact is not found", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();

    const res = await supertest(app)
      .get(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
      .set("X-API-TOKEN", "test");

    logger.debug(res.body);
    expect(res.status).toBe(404);
    expect(res.body.errors).toBeDefined();
  });
});

describe("PUT /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
    await AddressTest.create();
  });

  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should update address", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();

    const res = await supertest(app)
      .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("X-API-TOKEN", "test")
      .send({
        street: "test",
        city: "test",
        province: "test",
        country: "test",
        postal_code: "12345",
      });

    logger.debug(res.body);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(address.id);
    expect(res.body.data.street).toBe("test");
    expect(res.body.data.city).toBe("test");
    expect(res.body.data.province).toBe("test");
    expect(res.body.data.country).toBe("test");
    expect(res.body.data.postal_code).toBe("12345");
  })
});
