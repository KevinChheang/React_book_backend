"use strict";

/* Routes for ratings */

const express = require("express");
const router = new express.Router();

const Rating = require("../models/rating");
const { BadRequestError } = require("../expressError");

/** GET /  =>
 *   { ratings: [ { likes, dislikes } }
 *
 * Authorization required: must login
 */
router.get("/:isbn", async function(req, res, next) {
    try {
        const ratingsRes = await Rating.getRatings(req.params.isbn);
        return res.json({ratingsRes});
    } catch (error) {
        next(error);
    }
});

module.exports = router;