"use strict";

const db = require("../db");
const { 
    NotFoundError, 
    UnauthorizedError, 
    BadRequestError 
} = require("../expressError");

const User = require("./user");

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

/* authenticate */
describe("authenticate", function() {
    test("works", async function() {
        const user = await User.authenticate("test1", "testpassword1");
        expect(user).toEqual({
          username: "test1",
          firstName: "test first name",
          lastName: "test last name",
          email: "test@gmail.com",
        });
      });

      test("unauth if no such user", async function() {
        try {
          await User.authenticate("nope", "testpassword1");
        } catch (error) {
          expect(error instanceof UnauthorizedError).toBeTruthy();
        }
      });
    
      test("unauth if wrong password", async function() {
        try {
          await User.authenticate("test1", "wrong");
        } catch (error) {
          expect(error instanceof UnauthorizedError).toBeTruthy();
        }
      });
});

/* register */
describe("register", function() {
    const newUser = {
        username: "test3",
        firstName: "test first name",
        lastName: "test last name",
        email: "test@gmail.com",
    };

    test("works", async function() {
        const user = await User.register({
                ...newUser,
                password: "testpassword3"
            });

        expect(user).toEqual(newUser);
    });

    test("bad request with duplicate username", async function() {
        try {
          await User.register({
            ...newUser,
            password: "testpassword3",
          });
          await User.register({
            ...newUser,
            password: "testpassword3",
          });
        } catch (error) {
          expect(error instanceof BadRequestError).toBeTruthy();
        }
      });
});

/* get */
describe("get", function() {
    test("works", async function () {
        const user = await User.get("test1");

        expect(user).toEqual({
            username: "test1",
            firstName: "test first name",
            lastName: "test last name",
            email: "test@gmail.com",
        });
    });

    test("not found if no such user", async function () {
        try {
          await User.get("nope");
        } catch (err) {
          expect(err instanceof NotFoundError).toBeTruthy();
        }
      });
});

/* addFavBook */
describe("addFavBook", function() {
    test("works", async function() {
        const favBook = await User.addFavBook("test1", testBookIsbn[1]);

        expect(favBook).toEqual({
            username: "test1",
            isbn: testBookIsbn[1]
        });
    });

    test("works", async function() {
        const favBook = await User.addFavBook("test1", testBookIsbn[1]);

        expect(favBook).toEqual({
            username: "test1",
            isbn: testBookIsbn[1]
        });
    });

    test("won't add book if no such user", async function() {
        try {
            await User.addFavBook("nope", testBookIsbn[0]);
        } catch (error) {
            expect(error instanceof NotFoundError).toBeTruthy();
        }
    });

    test("won't add book if no such isbn", async function() {
        try {
            await User.addFavBook("test1", "0000");
        } catch (error) {
            expect(error instanceof NotFoundError).toBeTruthy();
        }
    });
});

/* deleteFavBook */
describe("deleteFavBook", function() {
    test("works", async function() {
        const deletedFavBook = await User.deleteFavBook(testBookIsbn[0]);

        expect(deletedFavBook).toEqual({deleted: testBookIsbn[0]});
    });

    test("won't delete fav book if no such isbn", async function() {
        try {
            await User.deleteFavBook("0000");
        } catch (error) {
            expect(error instanceof NotFoundError).toBeTruthy();
        }
    });
});

/* getFavBooks */
describe("getFavBooks", function() {
    test("works", async function() {
        const favBook = await User.getFavBooks("test2");

        expect(favBook).toEqual([
            {
                username: 'test2',
                isbn: testBookIsbn[1],
                title: 'Learning JavaScript Design Patterns',
                subtitle: "A JavaScript and jQuery Developer's Guide",
                author: 'Addy Osmani',
                publisher: "O'Reilly Media",
                pages: 254,
                year_published: 2012,
                img_url: 'https://images-na.ssl-images-amazon.com/images/I/51H-31ivMTL._SX379_BO1,204,203,200_.jpg',
                link: 'https://www.amazon.com/Learning-JavaScript-Design-Patterns-Developers/dp/1449331815/ref=sr_1_3?dchild=1&keywords=Learning+JavaScript+Design+Patterns&qid=1621984354&s=books&sr=1-3'
            }
        ]);
    });

    test("not found if no such user", async function() {
        try {
            await User.getFavBooks("nope");
        } catch (error) {
            expect(error instanceof NotFoundError).toBeTruthy();
        }
    });
});
// { username: 'test', isbn: '978-0596517748', is_like: true }
/* addLike */
describe("addLike", function() {
    test("works", async function() {
        const like = await User.addLike("test1", testBookIsbn[0]);

        expect(like).toEqual({
            username: "test1",
            isbn: testBookIsbn[0],
            is_like: true
        });
    });
});

/* addDislike */
describe("addDislike", function() {
    test("works", async function() {
        const dislike = await User.addDislike("test2", testBookIsbn[1]);

        expect(dislike).toEqual({
            username: "test2",
            isbn: testBookIsbn[1],
            is_dislike: true
        });
    });
});

/* addComment */
describe("addComment", function() {
    test("works", async function() {
        const comment = await User.addComment("test2", testBookIsbn[1], "Nice book");

        expect(comment).toEqual({
            username: "test2",
            isbn: testBookIsbn[1],
            comment: "Nice book"
        });
    });
});