"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testBookIsbn,
  u1Token,
  u2Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/* GET /users/:username */
describe("GET /users/:username", function() {
    test("works", async function() {
        const res = await request(app).get("/users/user1").set("authorization", `Bearer ${u1Token}`);

        expect(res.body).toEqual(
            {
                user: {
                    username: "user1",
                    firstName: "user1",
                    lastName: "user1",
                    email: "user@gmail.com",
                }
            }
            );
    });
});

/* POST  /users/:username/books/:isbn */
describe("POST  /users/:username/books/:isbn", function() {
    test("works", async function() {
        const res = await request(app).post(`/users/user1/books/${testBookIsbn[0]}`).set("authorization", `Bearer ${u1Token}`);

        expect(res.body).toEqual({added: testBookIsbn[0]});
    });
});

/* DELETE /users/:username/books/:isbn */
describe("DELETE /users/:username/books/:isbn", function() {
    test("works", async function() {
        const res = await request(app).delete(`/users/user1/books/${testBookIsbn[0]}`).set("authorization", `Bearer ${u1Token}`);

        expect(res.body).toEqual({deleted: testBookIsbn[0]});
    });
});

/* GET /users/favBook/:username */
describe("GET /users/favBook/:username",  function() {
    test("works", async function() {
        const res = await request(app).get("/users/favBook/user1").set("authorization", `Bearer ${u1Token}`);

        expect(res.body).toEqual(
            {
                favBooks: [
                    {
                    username: "user1",
                    isbn: testBookIsbn[0],
                    title: "Eloquent JavaScript",
                    subtitle: "A Modern Introduction to Programming",
                    author: "Marijn Haverbeke",
                    publisher: "No Starch Press",
                    year_published: 2018,
                    pages: 472,
                    description: "This much anticipated and thoroughly revised third edition of Eloquent JavaScript dives deep into the JavaScript language to show you how to write beautiful, effective code. It has been updated to reflect the current state of Java¬Script and web browsers and includes brand-new material on features like class notation, arrow functions, iterators, async functions, template strings, and block scope. A host of new exercises have also been added to test your skills and keep you on track.",
                    img_url: "https://images-na.ssl-images-amazon.com/images/I/51InjRPaF7L._SX377_BO1,204,203,200_.jpg",
                    link: "https://www.amazon.com/Eloquent-JavaScript-3rd-Introduction-Programming/dp/1593279507/ref=sr_1_3?dchild=1&keywords=Eloquent+JavaScript&qid=1621984209&s=books&sr=1-3",
                    }
                ]
            }
        );
    });

    test("fail with incorrect username", async function() {
        const res = await request(app).get("/users/favBook/nope").set("authorization", `Bearer ${u1Token}`);

        expect(res.statusCode).toEqual(401);
    });
});

/* POST /users/:username/ratings/:isbn/like */
describe("POST /users/:username/ratings/:isbn/like", function() {
    test("works", async function() {
        const res = await request(app).post(`/users/user1/ratings/${testBookIsbn[0]}/like`).set("authorization", `Bearer ${u1Token}`);

        expect(res.body).toEqual({like: true});
    }); 
});

/* POST /users/:username/ratings/:isbn/dislike */
describe("POST /users/:username/ratings/:isbn/dislike", function() {
    test("works", async function() {
        const res = await request(app).post(`/users/user1/ratings/${testBookIsbn[0]}/dislike`).set("authorization", `Bearer ${u1Token}`);

        expect(res.body).toEqual({dislike: true});
    }); 
});

/* POST /users/:username/books/:isbn/comment */
describe("POST /users/:username/books/:isbn/comment", function() {
    test("works", async function() {
        const res = await request(app).post(`/users/user1/books/${testBookIsbn[0]}/comment`).send({
            comment: "I find the book very helpful."
        }).set("authorization", `Bearer ${u1Token}`);

        expect(res.body).toEqual({
            added: "I find the book very helpful.",
        });
    });
});