"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const Rating = require("./rating");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testBookIsbn
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/* getRatings */
describe("getRatings", function () {
    test("works: all", async function() {
        let ratings = await Rating.getRatings(testBookIsbn[1]);

        expect(ratings).toEqual(
            {
                likes: [{likes: '1'}],
                dislikes: [{dislikes: '0'}]
            }
        );
    });

    test("not found if no such book", async function () {
        try {
            await Rating.getRatings("1111");
        } catch (error) {
            expect(error instanceof NotFoundError).toBeTruthy();
        }
    });
});

