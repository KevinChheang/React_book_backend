"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testBookIsbn,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/* GET /comments */
describe("GET /comments", function() {
    test("works", async function() {
        const res = await request(app).get("/comments");

        expect(res.body).toEqual(
            {
                comments: [
                    {
                        id: res.body.comments[0].id,
                        username: "user1",
                        isbn: testBookIsbn[0],
                        comment: "Amazing book."
                    },
                ]
            }
        );
    });
});