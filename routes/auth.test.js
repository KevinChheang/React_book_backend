"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/* POST /auth/token */

describe("POST /auth/token", function () {
    test("works", async function () {
      const resp = await request(app)
          .post("/auth/token")
          .send({
            username: "user1",
            password: "password",
          });

      expect(resp.body).toEqual({
        "token": expect.any(String),
      });
    });
  
    test("unauth with non-existent user", async function () {
      const resp = await request(app)
          .post("/auth/token")
          .send({
            username: "not a user",
            password: "password",
          });

      expect(resp.statusCode).toEqual(401);
    });
  
    test("unauth with incorrect password", async function () {
      const resp = await request(app)
          .post("/auth/token")
          .send({
            username: "user1",
            password: "nope",
          });

      expect(resp.statusCode).toEqual(401);
    });
  
    test("bad request with missing data", async function () {
      const resp = await request(app)
          .post("/auth/token")
          .send({
            username: "user1",
          });

      expect(resp.statusCode).toEqual(400);
    });
  
    test("bad request with invalid data", async function () {
      const resp = await request(app)
          .post("/auth/token")
          .send({
            username: 1,
            password: "password",
          });

      expect(resp.statusCode).toEqual(400);
    });
});

/* POST /auth/register */

describe("POST /auth/register", function () {
    test("works for anon", async function () {
      const resp = await request(app)
          .post("/auth/register")
          .send({
            username: "user3",
            firstName: "user3",
            lastName: "user3",
            password: "password",
            email: "user@gmail.com",
          });

      expect(resp.statusCode).toEqual(201);
      expect(resp.body).toEqual({
        "token": expect.any(String),
      });
    });
  
    test("bad request with missing fields", async function () {
      const resp = await request(app)
          .post("/auth/register")
          .send({
            username: "user3",
          });

      expect(resp.statusCode).toEqual(400);
    });
  });
  