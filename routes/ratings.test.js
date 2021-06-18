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

/* GET /ratings/:isbn */
describe("GET /ratings/:isbn", function() {
    test("works", async function() {
        const res = await request(app).get(`/ratings/${testBookIsbn[0]}`);

        console.log("res", res.body);

        expect(res.body).toEqual(
            {
                ratingsRes: 
                    {
                        likes: [
                            {likes: "1"}
                        ],
                        dislikes: [
                            {dislikes: "0"}
                        ],
                    },
                
            }
        );
    });
});