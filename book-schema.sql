CREATE TABLE books (
  isbn TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  author TEXT NOT NULL,
  publisher TEXT NOT NULL,
  year_published INTEGER NOT NULL,
  pages INTEGER NOT NULL,
  description TEXT NOT NULL,
  img_url TEXT NOT NULL,
  link TEXT NOT NULL 
);

CREATE TABLE users (
  username VARCHAR(40) PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  password TEXT NOT NULL
);

CREATE TABLE fav_books (
  id SERIAL PRIMARY KEY,
  username TEXT REFERENCES users ON DELETE CASCADE,
  isbn TEXT REFERENCES books ON DELETE CASCADE
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  username TEXT REFERENCES users ON DELETE CASCADE,
  isbn TEXT REFERENCES books ON DELETE CASCADE,
  comment TEXT NOT NULL
);

CREATE TABLE likes_dislikes (
  id SERIAL PRIMARY KEY,
  username TEXT REFERENCES users ON DELETE SET NULL,
  isbn TEXT REFERENCES books ON DELETE SET NULL,
  is_like BOOLEAN NOT NULL DEFAULT FALSE,
  is_dislike BOOLEAN NOT NULL DEFAULT FALSE
);