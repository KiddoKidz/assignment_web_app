-- Authors table
CREATE TABLE IF NOT EXISTS authors (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Books table
CREATE TABLE IF NOT EXISTS books (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    publishing_year INTEGER,
    author_id BIGINT NOT NULL REFERENCES authors(id)
);

-- Members table
CREATE TABLE IF NOT EXISTS members (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20)
);

-- Borrowed_books table
CREATE TABLE IF NOT EXISTS borrowed_books (
    id BIGSERIAL PRIMARY KEY,
    book_id BIGINT NOT NULL REFERENCES books(id),
    member_id BIGINT NOT NULL REFERENCES members(id),
    borrow_date DATE NOT NULL,
    return_date DATE
);
