/* Express app for Book */

const express = require("express");
const app = express();

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const booksRoutes = require("./routes/books");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const commentRoutes = require("./routes/comments");
const ratingRoutes = require("./routes/ratings");

const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(authenticateJWT);
app.use("/books", booksRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/comments", commentRoutes);
app.use("/ratings", ratingRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
    return next(new NotFoundError());
  });
  
/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});

module.exports = app;