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

/* GET /books */
describe("GET /books", function() {
    test("works: no filter", async function() {
        const res = await request(app).get("/books");

        expect(res.body).toEqual({
            books: [
                {
                    isbn: testBookIsbn[0],
                    title: "Eloquent JavaScript",
                    subtitle: "A Modern Introduction to Programming",
                    author: "Marijn Haverbeke",
                    publisher: "No Starch Press",
                    yearpublished: 2018,
                    pages: 472,
                    description: "This much anticipated and thoroughly revised third edition of Eloquent JavaScript dives deep into the JavaScript language to show you how to write beautiful, effective code. It has been updated to reflect the current state of Java¬Script and web browsers and includes brand-new material on features like class notation, arrow functions, iterators, async functions, template strings, and block scope. A host of new exercises have also been added to test your skills and keep you on track.",
                    img_url: "https://images-na.ssl-images-amazon.com/images/I/51InjRPaF7L._SX377_BO1,204,203,200_.jpg",
                    link: "https://www.amazon.com/Eloquent-JavaScript-3rd-Introduction-Programming/dp/1593279507/ref=sr_1_3?dchild=1&keywords=Eloquent+JavaScript&qid=1621984209&s=books&sr=1-3",
                },
                {
                    isbn: testBookIsbn[1],
                    title: "Learning JavaScript Design Patterns",
                    subtitle: "A JavaScript and jQuery Developer's Guide",
                    author: "Addy Osmani",
                    publisher: "O'Reilly Media",
                    yearpublished: 2012,
                    pages: 254,
                    description: "With Learning JavaScript Design Patterns, you'll learn how to write beautiful, structured, and maintainable JavaScript by applying classical and modern design patterns to the language. If you want to keep your code efficient, more manageable, and up-to-date with the latest best practices, this book is for you.",
                    img_url: "https://images-na.ssl-images-amazon.com/images/I/51H-31ivMTL._SX379_BO1,204,203,200_.jpg",
                    link: "https://www.amazon.com/Learning-JavaScript-Design-Patterns-Developers/dp/1449331815/ref=sr_1_3?dchild=1&keywords=Learning+JavaScript+Design+Patterns&qid=1621984354&s=books&sr=1-3",
                }
            ]
        });
    });

    test("works: filter by title", async function() {
        const res = await request(app).get("/books").query({title: "Eloquent JavaScript"});

        expect(res.body).toEqual(
            {
                books: [{
                isbn: testBookIsbn[0],
                title: "Eloquent JavaScript",
                subtitle: "A Modern Introduction to Programming",
                author: "Marijn Haverbeke",
                publisher: "No Starch Press",
                yearpublished: 2018,
                pages: 472,
                description: "This much anticipated and thoroughly revised third edition of Eloquent JavaScript dives deep into the JavaScript language to show you how to write beautiful, effective code. It has been updated to reflect the current state of Java¬Script and web browsers and includes brand-new material on features like class notation, arrow functions, iterators, async functions, template strings, and block scope. A host of new exercises have also been added to test your skills and keep you on track.",
                img_url: "https://images-na.ssl-images-amazon.com/images/I/51InjRPaF7L._SX377_BO1,204,203,200_.jpg",
                link: "https://www.amazon.com/Eloquent-JavaScript-3rd-Introduction-Programming/dp/1593279507/ref=sr_1_3?dchild=1&keywords=Eloquent+JavaScript&qid=1621984209&s=books&sr=1-3",
            }]
        });
    });
});

/* GET /books/:isbn */
describe("GET /books/:isbn", function() {
    test("works", async function() {
        const res = await request(app).get(`/books/${testBookIsbn[0]}`);

        expect(res.body).toEqual(
            {
                book: {
                isbn: testBookIsbn[0],
                title: "Eloquent JavaScript",
                subtitle: "A Modern Introduction to Programming",
                author: "Marijn Haverbeke",
                publisher: "No Starch Press",
                yearpublished: 2018,
                pages: 472,
                description: "This much anticipated and thoroughly revised third edition of Eloquent JavaScript dives deep into the JavaScript language to show you how to write beautiful, effective code. It has been updated to reflect the current state of Java¬Script and web browsers and includes brand-new material on features like class notation, arrow functions, iterators, async functions, template strings, and block scope. A host of new exercises have also been added to test your skills and keep you on track.",
                img_url: "https://images-na.ssl-images-amazon.com/images/I/51InjRPaF7L._SX377_BO1,204,203,200_.jpg",
                link: "https://www.amazon.com/Eloquent-JavaScript-3rd-Introduction-Programming/dp/1593279507/ref=sr_1_3?dchild=1&keywords=Eloquent+JavaScript&qid=1621984209&s=books&sr=1-3",
            }
        });
    });

    test("not found for no such isbn", async function() {
        const res = await request(app).get("/books/000");

        expect(res.statusCode).toEqual(404);
    });
});