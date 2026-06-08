DROP TABLE IF EXISTS orders_products CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id serial PRIMARY KEY,
    username text UNIQUE NOT NULL,
    password text NOT NULL
);

CREATE TABLE products (
    id serial PRIMARY KEY,
    title text NOT NULL,
    description text NOT NULL,
    price decimal NOT NULL
);

CREATE TABLE orders (
    id serial PRIMARY KEY,
    date date NOT NULL,
    note text,
    user_id int NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE orders_products (
    order_id int NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id int NOT NULL REFERENCES products(id) on DELETE CASCADE,
    quantity int NOT NULL,
    PRIMARY KEY (order_id, product_id)
);
