"use strict";

const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");


/** Related functions for rating. */

class Rating {
    /** Get all book ratings 
   *
   * Returns [{ id, username, isbn, is_like, is_dislike }]
   * */
     static async getRatings(isbn) {
        let likesRes = await db.query(`SELECT COUNT(is_like) AS likes
                                 FROM likes_dislikes
                                 WHERE is_like = $1 AND isbn = $2`, [true, isbn]);

        let dislikesRes = await db.query(`SELECT COUNT(is_dislike) AS dislikes
                                 FROM likes_dislikes
                                 WHERE is_dislike = $1 AND isbn = $2`, [true, isbn]);

        return {"likes": likesRes.rows, "dislikes": dislikesRes.rows};
    }
}

module.exports = Rating;