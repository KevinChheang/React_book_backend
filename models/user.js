"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email }
   *
   * Throws UnauthorizedError if user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
          `SELECT username,
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email
           FROM users
           WHERE username = $1`,
        [username],
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { username, firstName, lastName, email }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register(
      { username, password, firstName, lastName, email }) {
    const duplicateCheck = await db.query(
          `SELECT username
           FROM users
           WHERE username = $1`,
        [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
          `INSERT INTO users
           (username,
            password,
            first_name,
            last_name,
            email)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING username, first_name AS "firstName", last_name AS "lastName", email`,
        [
          username,
          hashedPassword,
          firstName,
          lastName,
          email
        ],
    );

    const user = result.rows[0];

    return user;
  }

  /** Find all users.
   *
   * Returns [{ username, first_name, last_name, email }, ...]
   **/

  // static async findAll() {
  //   const result = await db.query(
  //         `SELECT username,
  //                 first_name AS "firstName",
  //                 last_name AS "lastName",
  //                 email"
  //          FROM users
  //          ORDER BY username`,
  //   );

  //   return result.rows;
  // }

  /** Given a username, return data about user.
   *
   * Returns { username, first_name, last_name, email }
   * Throws NotFoundError if user not found.
   **/

  static async get(username) {
    const userRes = await db.query(
          `SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email
           FROM users
           WHERE username = $1`,
        [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }

  /** Add a book to fav: update db, returns undefined.
   *
   * - username: username adding the book
   * - isbn: book isbn
   **/
  static async addFavBook(username, isbn) {
    // check if book exist
    const preCheckBook = await db.query(
      `SELECT isbn
       FROM books
       WHERE isbn = $1`, [isbn]);

    if(!preCheckBook.rows[0]) throw new NotFoundError(`No book found with isbn: ${isbn}`);

    // check if user exist
    const preCheckUser = await db.query(
      `SELECT username
       FROM users
       WHERE username = $1`, [username]);

    if(!preCheckUser.rows[0]) throw new NotFoundError(`No user found with username: ${username}`);

    // add to fav_books table
    const favBook = await db.query(
      `INSERT INTO fav_books (username, isbn)
       VALUES ($1, $2)
       RETURNING username, isbn`, [username, isbn]);

    return favBook.rows[0];
  }

  /** Delete a book from fav: update db, returns undefined.
   *
   * - username: username adding the book
   * - isbn: book isbn
   **/
   static async deleteFavBook(isbn) {
    // check if book exist
    const preCheckBook = await db.query(
      `SELECT isbn
       FROM books
       WHERE isbn = $1`, [isbn]);

    if(!preCheckBook.rows[0]) throw new NotFoundError(`No book found with isbn: ${isbn}`);

    // delete from fab_books table
    await db.query(
      `DELETE FROM fav_books WHERE isbn = $1`, [isbn]);

    return ({"deleted": isbn});
  }

  /** Given a username, return user's fav books.
   *
   * Returns { username, isbn, title, subtitle, author,
   * publisher, pages, year_published, img_url, link }
   * Throws NotFoundError if user not found.
   **/
  static async getFavBooks(username) {
    // check if user exist
    const preCheckUser = await db.query(
      `SELECT username
       FROM users
       WHERE username = $1`, [username]);

    if(!preCheckUser.rows[0]) throw new NotFoundError(`No books found with username: ${username}`);


    const favBooksRes = await db.query(
      `SELECT u.username, b.isbn, b.title, b.subtitle, 
              b.author, b.publisher, b.pages, b.year_published, b.description, b.img_url, b.link
       FROM users AS u
       LEFT JOIN fav_books AS fb
       ON u.username = fb.username
       LEFT JOIN books as b
       ON fb.isbn = b.isbn
       WHERE u.username = $1`, [username]);

    return favBooksRes.rows;
  }

  /** Add a like to table: : update db, returns undefined.
   *
   * - username: user who's adding the book
   * - isbn: book isbn
   **/
   static async addLike(username, isbn) {
    const like = await db.query(
      `INSERT INTO likes_dislikes (username, isbn, is_like)
       VALUES ($1, $2, $3)
       RETURNING username, isbn, is_like`, [username, isbn, true]);
    
    return like.rows[0];
  }

  /** Add a dislike to table: : update db, returns undefined.
   *
   * - username: user who's rating the book
   * - isbn: book isbn
   **/
   static async addDislike(username, isbn) {
    const dislike = await db.query(
      `INSERT INTO likes_dislikes (username, isbn, is_dislike)
       VALUES ($1, $2, $3)
       RETURNING username, isbn, is_dislike`, [username, isbn, true]);

    return dislike.rows[0];
  }

  /** Add a comment to table: : update db, returns undefined.
   *
   * - username: user who's adding the book
   * - isbn: book isbn
   * - comment: comment itself
   **/
   static async addComment(username, isbn, comment) {
    const addedComment = await db.query(
      `INSERT INTO comments (username, isbn, comment)
       VALUES ($1, $2, $3)
       RETURNING username, isbn, comment`, [username, isbn, comment]);

    return addedComment.rows[0];
  }
}


module.exports = User;
