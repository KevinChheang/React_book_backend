"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUser } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");

const router = express.Router();


/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, email}
 * Authorization required: same user-as-:username
 **/

router.get("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** POST /[username]/books/[isbn] => { fav_books }
 *
 * Add book to fav list
 * Returns {"added": isbn}
 *
 * Authorization required: must login
 * */
router.post("/:username/books/:isbn", async function(req, res, next) {
    try {
      await User.addFavBook(req.params.username, req.params.isbn);

      return res.json({added: req.params.isbn});
    } catch (error) {
      return next(error);
    }
});

/** DELETE /[username]/books/[isbn] => { fav_books }
 *
 * Delete book from fav list
 * Returns {"deleted"}
 *
 * Authorization required: must login
 * */
router.delete("/:username/books/:isbn", async function(req, res, next) {
  try {
    await User.deleteFavBook(req.params.isbn);

    return res.json({"deleted": req.params.isbn});
  } catch (error) {
    return next(error);
  }
});

/** GET /[username] => { fav_book }
 *
 * Returns { username, isbn, title, subtitle, 
              author, publisher, pages, year_published, img_url, link }
 * Authorization required: must login
 **/

router.get("/favBook/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const favBooks = await User.getFavBooks(req.params.username);
    return res.json({ favBooks });
  } catch (err) {
    return next(err);
  }
});

/** POST /[username]/ratings/[isbn]/like => { like }
 *
 * Add like to book
 * Returns {like}
 *
 * Authorization required: must login
 * */
router.post("/:username/ratings/:isbn/like", async function(req, res, next) {
  try {
    await User.addLike(req.params.username, req.params.isbn);

    return res.json({"like": true});
  } catch (error) {
    return next(error);
  }
});

/** POST /[username]/ratings/[isbn]/dislike => { dislike }
 *
 * Returns {dislike}
 *
 * Authorization required: must login
 * */
 router.post("/:username/ratings/:isbn/dislike", async function(req, res, next) {
  try {
    await User.addDislike(req.params.username, req.params.isbn);

    return res.json({"dislike": true});
  } catch (error) {
    return next(error);
  }
});

/** POST /[username]/books/[isbn]/comment => { comments }
 *
 * Add comment for book
 * Returns {"added": isbn}
 *
 * Authorization required: must login
 * */
router.post("/:username/books/:isbn/comment", async function(req, res, next) {
  try {
    await User.addComment(req.params.username, req.params.isbn, req.body.comment);

    return res.json({added: req.body.comment});
  } catch (error) {
    return next(error);
  }
});


module.exports = router;
