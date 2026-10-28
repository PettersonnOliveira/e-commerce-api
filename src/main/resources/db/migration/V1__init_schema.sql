-- Migração V1: Criação do esquema inicial do banco de dados NEXUS STORE

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    price DOUBLE,
    stock INT,
    category_id BIGINT,
    CONSTRAINT fk_products_categories FOREIGN KEY (category_id) REFERENCES categories (id)
);

CREATE TABLE IF NOT EXISTS carts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    CONSTRAINT fk_carts_users FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quantity INT NOT NULL,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    CONSTRAINT fk_cart_items_carts FOREIGN KEY (cart_id) REFERENCES carts (id),
    CONSTRAINT fk_cart_items_products FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    status VARCHAR(255) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_orders_users FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS orderitens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    price DOUBLE NOT NULL,
    quantity INT NOT NULL,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    CONSTRAINT fk_orderitens_orders FOREIGN KEY (order_id) REFERENCES orders (id),
    CONSTRAINT fk_orderitens_products FOREIGN KEY (product_id) REFERENCES products (id)
);
