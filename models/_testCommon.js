process.env.NODE_ENV = "test";

const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

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

    await db.query(`
        INSERT INTO users (username, first_name, last_name, email, password)
        VALUES ('test1', 'test first name', 'test last name', 'test@gmail.com', $1),
               ('test2', 'test first name', 'test last name', 'test@gmail.com', $2)
        RETURNING username`,
               [
                await bcrypt.hash("testpassword1", BCRYPT_WORK_FACTOR),
                await bcrypt.hash("testpassword2", BCRYPT_WORK_FACTOR)
            ]);

    await db.query(`
        INSERT INTO comments (username, isbn, comment)
        VALUES ('test1', $1, 'Amazing book.')
        RETURNING id`, [testBookIsbn[0]]);

    await db.query(`
        INSERT INTO fav_books (username, isbn)
        VALUES ('test2', $1)`, [testBookIsbn[1]]);

    await db.query(`
        INSERT INTO likes_dislikes (username, isbn, is_like, is_dislike)
        VALUES ('test1', $1, true, false)`, [testBookIsbn[1]]);

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

module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testBookIsbn,
  };

