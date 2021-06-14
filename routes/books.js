"use strict";

/* Routes for books */

const express = require("express");
const router = new express.Router();

const Book = require("../models/book");
const { BadRequestError } = require("../expressError");

/** GET /  =>
 *   { books: [ { isbn, title, subtitle, author, publisher, year_published, pages, img_url, link } }
 *
 * Can filter on provided search filters:
 * - title (will find case-insensitive, partial matches)
 *
 * Authorization required: must login
 */
router.get("/", async function(req, res, next) {
    try {
        const books = await Book.findAll(req.query);
        return res.json({books});
    } catch (error) {
        next(error);
    }
});

/** GET / [isbn]  =>
 *   { book: [ { isbn, title, subtitle, author, publisher, year_published, pages, img_url, link } }
 *
 * Can filter on provided search filters:
 * - title (will find case-insensitive, partial matches)
 *
 * Authorization required: must login
 */
router.get("/:isbn", async function(req, res, next) {
    try {
        const book = await Book.findByIsbn(req.params.isbn);
        return res.json({book});
    } catch (error) {
        next(error);
    }
});

module.exports = router;