"use strict";

const db = require("../db");

/* Related functions for comments. */
class Comment {

    /** Get all comments 
     *
     * Returns [{ id, username, isbn, comment }]
     * */
    static async getAll() {
        let commentsRes = await db.query(`
                                    SELECT id,
                                           username,
                                           isbn,
                                           comment
                                    FROM comments`);

        return commentsRes.rows;
    }
}

module.exports = Comment;