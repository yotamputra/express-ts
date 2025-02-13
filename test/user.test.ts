import supertest from "supertest";
import { app } from "../src/application/app";
import { logger } from "../src/application/logging";
import { UserTest } from "./test.util";
import { comparePass } from "../src/helpers/bcrypt";

describe("POST /api/users", () => {
  afterEach(async () => {
    await UserTest.delete();
  });

  it("should reject register new user if request is invalid", async () => {
    const response = await supertest(app).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should register new user", async () => {
    const response = await supertest(app).post("/api/users").send({
      username: "test",
      password: "test",
      name: "test",
    });

    logger.debug(response.body);
    expect(response.status).toBe(201);
    expect(response.body.data.username).toBe("test");
    expect(response.body.data.name).toBe("test");
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should reject login if request is invalid", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      username: "",
      password: "",
    });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should reject login if username is wrong", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      username: "123",
      password: "test",
    });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });

  it("should reject login if password is wrong", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      username: "test",
      password: "123",
    });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });

  it("should return token", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      username: "test",
      password: "test",
    });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("test");
    expect(response.body.data.name).toBe("test");
    expect(response.body.data.token).toBeDefined();
  });
});

describe("GET /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should be able to get user", async () => {
    const res = await supertest(app)
      .get("/api/users/current")
      .set("X-API-TOKEN", "test");

    logger.debug(res.body);
    expect(res.status).toBe(200);
    expect(res.body.data.username).toBe("test");
    expect(res.body.data.name).toBe("test");
  });

  it("should reject get User if token invalid", async () => {
    const res = await supertest(app)
      .get("/api/users/current")
      .set("X-API-TOKEN", "123");

    logger.debug(res.body);
    expect(res.status).toBe(401);
    expect(res.body.errors).toBeDefined();
  });
});

describe("PATCH /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should reject if request is invalid", async () => {
    const res = await supertest(app)
      .patch("/api/users/current")
      .set("X-API-TOKEN", "test")
      .send({
        name: "",
        password: "",
      });

    logger.debug(res.body);
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it("should reject if token is invalid", async () => {
    const res = await supertest(app)
      .patch("/api/users/current")
      .set("X-API-TOKEN", "123")
      .send({
        name: "test2",
        password: "test2",
      });

    logger.debug(res.body);
    expect(res.status).toBe(401);
    expect(res.body.errors).toBeDefined();
  });

  it("should be able to update user name", async () => {
    const res = await supertest(app)
      .patch("/api/users/current")
      .set("X-API-TOKEN", "test")
      .send({
        name: "test2",
      });

    logger.debug(res.body);
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("test2");
  });

  it("should be able to update user password", async () => {
    const res = await supertest(app)
      .patch("/api/users/current")
      .set("X-API-TOKEN", "test")
      .send({
        password: "test2",
      });

    logger.debug(res.body);
    expect(res.status).toBe(200);

    const user = await UserTest.get();

    expect(await comparePass("test2", user.password)).toBe(true);
  });
});
