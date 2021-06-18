"use strict";

const db = require("../db.js");
const User = require("../models/user");

const { createToken } = require("../helpers/tokens");

const testBookIsbn = [];

async function commonBeforeAll() {
    await db.query("DELETE FROM books");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM likes_dislikes");

    const booksRes = await db.query(`
        INSERT INTO books (isbn, title, subtitle, author, publisher, year_published, pages, description, img_url, link)
        VALUES ('978-1593279509', 'Eloquent JavaScript', 'A Modern Introduction to Programming', 'Marijn Haverbeke', 'No Starch Press', 2018, 472, 'This much anticipated and thoroughly revised third edition of Eloquent JavaScript dives deep into the JavaScript language to show you how to write beautiful, effective code. It has been updated to reflect the current state of Java¬Script and web browsers and includes brand-new material on features like class notation, arrow functions, iterators, async functions, template strings, and block scope. A host of new exercises have also been added to test your skills and keep you on track.', 'https://images-na.ssl-images-amazon.com/images/I/51InjRPaF7L._SX377_BO1,204,203,200_.jpg', 'https://www.amazon.com/Eloquent-JavaScript-3rd-Introduction-Programming/dp/1593279507/ref=sr_1_3?dchild=1&keywords=Eloquent+JavaScript&qid=1621984209&s=books&sr=1-3'),
        ('978-1449331818', 'Learning JavaScript Design Patterns', 'A JavaScript and jQuery Developer''s Guide', 'Addy Osmani', 'O''Reilly Media', 2012, 254, 'With Learning JavaScript Design Patterns, you''ll learn how to write beautiful, structured, and maintainable JavaScript by applying classical and modern design patterns to the language. If you want to keep your code efficient, more manageable, and up-to-date with the latest best practices, this book is for you.', 'https://images-na.ssl-images-amazon.com/images/I/51H-31ivMTL._SX379_BO1,204,203,200_.jpg', 'https://www.amazon.com/Learning-JavaScript-Design-Patterns-Developers/dp/1449331815/ref=sr_1_3?dchild=1&keywords=Learning+JavaScript+Design+Patterns&qid=1621984354&s=books&sr=1-3')
        RETURNING isbn`);

    testBookIsbn.splice(0, 0, ...booksRes.rows.map(book => book.isbn));

    await User.register({
        username: "user1",
        password: "password",
        firstName: "user1",
        lastName: "user1",
        email: 'user@gmail.com'
    });

    await User.register({
        username: "user2",
        password: "password",
        firstName: "user2",
        lastName: "user2",
        email: 'user@gmail.com'
    });


    await db.query(`
        INSERT INTO comments (username, isbn, comment)
        VALUES ('user1', $1, 'Amazing book.')
        RETURNING id`, [testBookIsbn[0]]);

    await db.query(`
        INSERT INTO likes_dislikes (username, isbn, is_like, is_dislike)
        VALUES ('user1', $1, true, false)
        RETURNING id`, [testBookIsbn[0]]);

    await db.query(`
        INSERT INTO fav_books (username, isbn)
        VALUES ('user1', $1)
        RETURNING id`, [testBookIsbn[0]]);
}

async function commonBeforeEach() {
    await db.query("BEGIN");
  }
  
async function commonAfterEach() {
await db.query("ROLLBACK");
}

async function commonAfterAll() {
await db.end();
}

const u1Token = createToken({ username: "user1" });
const u2Token = createToken({ username: "user2" });

  module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testBookIsbn,
    u1Token,
    u2Token,
  };