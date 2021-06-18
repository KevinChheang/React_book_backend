\echo 'Delete and recreate book db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE react_book;
CREATE DATABASE react_book;
\connect react_book

\i book-schema.sql
\i book-seed.sql

\echo 'Delete and recreate react_book_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE react_book_test;
CREATE DATABASE react_book_test;
\connect react_book_test

\i book-schema.sql
\i book-seed.sql
