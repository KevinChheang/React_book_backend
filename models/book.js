"use strict"

const db = require("../db");
const {BadRequestError, NotFoundError} = require("../expressError");

/* Related functions for books. */

class Book {
  /** Find all books (optional filter on searchFilters).
   *
   * searchFilters (all optional):
   * - title (will find case-insensitive, partial matches)
   * Returns [{ isbn, title, subtitle, author, publisher, year_published, pages, img_url, link }]
   * */
    static async findAll(searchFilters = {}) {
        let query = `SELECT isbn,
                    title,
                    subtitle,
                    author,
                    publisher,
                    year_published AS yearPublished,
                    pages,
                    img_url,
                    link
            FROM books`;

        let whereExpressions = [];
        let queryValues = [];

        const { title } = searchFilters;

        // For each possible search term, add to whereExpressions and queryValues so
        // we can generate the right SQL

        if (title !== undefined) {
            queryValues.push(`%${title}%`);
            whereExpressions.push(`title ILIKE $${queryValues.length}`);
        }

        if (whereExpressions.length > 0) {
            query += " WHERE " + whereExpressions.join("");
          }

        // Finalize query and return results
        const booksRes = await db.query(query, queryValues);

        return booksRes.rows;
    }

    static async findByIsbn(isbn) {
        const bookRes = await db.query(
            `SELECT isbn,
                    title,
                    subtitle,
                    author,
                    publisher,
                    description,
                    year_published AS yearPublished,
                    pages,
                    img_url,
                    link
            FROM books WHERE isbn=$1`, [isbn]);

        return bookRes.rows[0];
    }
}

module.exports = Book;