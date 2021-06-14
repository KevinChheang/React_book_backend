"use strict";

/* Routes for comments */

const express = require("express");
const router = new express.Router();

const Comment = require("../models/comment");

/** GET /  =>
 *   { comments: [ { id, username, isbn, comment } }
 *
 * Authorization required: must login
 */
 router.get("/", async function(req, res, next) {
    try {
        const comments = await Comment.getAll();

        return res.json({comments});
    } catch (error) {
        next(error);
    }
});

module.exports = router;