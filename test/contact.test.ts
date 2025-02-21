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

  it("should reject create a contact  if data is invalid", async () => {
    const response = await supertest(app)
      .post("/api/contacts")
      .set("X-API-TOKEN", "test")
      .send({
        first_name: "",
        last_name: "",
        email: "test",
        phone: "1234567890124142342423424242423",
      });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should get a contact", async () => {
    const contact = await ContactTest.get();
    const res = await supertest(app)
      .get(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "test");

    logger.debug(res.body);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.first_name).toBe(contact.first_name);
    expect(res.body.data.last_name).toBe(contact.last_name);
    expect(res.body.data.email).toBe(contact.email);
    expect(res.body.data.phone).toBe(contact.phone);
  });

  it("should reject get a contact if contact is not found", async () => {
    const contact = await ContactTest.get();
    const res = await supertest(app)
      .get(`/api/contacts/${contact.id + 1}`)
      .set("X-API-TOKEN", "test");

    logger.debug(res.body);
    expect(res.status).toBe(404);
    expect(res.body.errors).toBeDefined();
  });
});

describe("PUT /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should update a contact", async () => {
    const contact = await ContactTest.get();
    const res = await supertest(app)
      .put(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "test")
      .send({
        first_name: "test123",
        last_name: "test123",
        email: "test123@mail.com",
        phone: "111111111",
      });

    logger.debug(res.body);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(contact.id);
    expect(res.body.data.first_name).toBe("test123");
    expect(res.body.data.last_name).toBe("test123");
    expect(res.body.data.email).toBe("test123@mail.com");
    expect(res.body.data.phone).toBe("111111111");
  });

  it("should reject update a contact if request is invalid", async () => {
    const contact = await ContactTest.get();
    const res = await supertest(app)
      .put(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "test")
      .send({
        first_name: "",
        last_name: "",
        email: "test",
        phone: "",
      });

    logger.debug(res.body);
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});

describe("DELETE /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should delete a contact", async () => {
    const contact = await ContactTest.get();
    const res = await supertest(app)
      .delete(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "test");

    logger.debug(res.body);
    expect(res.status).toBe(200);
    expect(res.body.data).toBe("OK");
  });

  it("should reject delete a contact if contact is not found", async () => {
    const contact = await ContactTest.get();
    const res = await supertest(app)
      .delete(`/api/contacts/${contact.id + 1}`)
      .set("X-API-TOKEN", "test");

    logger.debug(res.body);
    expect(res.status).toBe(404);
    expect(res.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should able to search contacts", async () => {
    const res = await supertest(app)
      .get(`/api/contacts`)
      .set("X-API-TOKEN", "test");

    logger.debug(res.body);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.paging.current_page).toBe(1);
    expect(res.body.paging.total_page).toBe(1);
    expect(res.body.paging.size).toBe(10);
  });

  it("should able to search contacts using name", async () => {
    const res = await supertest(app)
      .get(`/api/contacts`)
      .query({ name: "es" })
      .set("X-API-TOKEN", "test");

    logger.debug(res.body);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.paging.current_page).toBe(1);
    expect(res.body.paging.total_page).toBe(1);
    expect(res.body.paging.size).toBe(10);
  });

  it("should able to search contacts using email", async () => {
    const res = await supertest(app)
      .get(`/api/contacts`)
      .query({ email: ".com" })
      .set("X-API-TOKEN", "test");

    logger.debug(res.body);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.paging.current_page).toBe(1);
    expect(res.body.paging.total_page).toBe(1);
    expect(res.body.paging.size).toBe(10);
  });

  it("should able to search contacts using phone", async () => {
    const res = await supertest(app)
      .get(`/api/contacts`)
      .query({ phone: "123" })
      .set("X-API-TOKEN", "test");

    logger.debug(res.body);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.paging.current_page).toBe(1);
    expect(res.body.paging.total_page).toBe(1);
    expect(res.body.paging.size).toBe(10);
  });

  it("should able to search contact, no result", async () => {
    const res = await supertest(app)
      .get(`/api/contacts`)
      .query({ name: "123" })
      .set("X-API-TOKEN", "test");

    logger.debug(res.body);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(0);
    expect(res.body.paging.current_page).toBe(1);
    expect(res.body.paging.total_page).toBe(0);
    expect(res.body.paging.size).toBe(10);
  });

  it("should able to search contacts with paging", async () => {
    const res = await supertest(app)
      .get(`/api/contacts`)
      .query({
        page: 2,
        size: 1,
      })
      .set("X-API-TOKEN", "test");

    logger.debug(res.body);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(0);
    expect(res.body.paging.current_page).toBe(2);
    expect(res.body.paging.total_page).toBe(1);
    expect(res.body.paging.size).toBe(1);
  });
});
