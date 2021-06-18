"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const Comment = require("./comment");

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

/* getAll */
describe("getAll", function () {
    test("works: all", async function() {
        let comments = await Comment.getAll();

        expect(comments).toEqual([
            {
                id: comments[0].id,
                username: "test1",
                isbn: testBookIsbn[0],
                comment: "Amazing book."
            }
        ]);
    });
});

