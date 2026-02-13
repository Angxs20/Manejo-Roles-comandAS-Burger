CREATE DATABASE IF NOT EXISTS pedidosDB;
USE pedidosDB;


-- Roles sugeridos: 1=Admin, 2=Cocinero, 3=Cliente (NUEVO)
CREATE TABLE users (
    idusers CHAR(36) PRIMARY KEY,
    name VARCHAR(45),
    password VARCHAR(255),
    phone VARCHAR(45),
    rol TINYINT(1), 
    actual_order CHAR(36)
);


CREATE TABLE category (
    idcategory CHAR(36) PRIMARY KEY,
    name VARCHAR(45)
);


CREATE TABLE products (
    idproducts CHAR(36) PRIMARY KEY,
    name VARCHAR(45),
    price INT,
    description VARCHAR(45),
    active TINYINT(1),
    category_idcategory CHAR(36),
    FOREIGN KEY (category_idcategory) REFERENCES category(idcategory)
);


CREATE TABLE favorites (
    users_idusers CHAR(36),
    products_idproducts CHAR(36),
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (users_idusers, products_idproducts), 
    FOREIGN KEY (users_idusers) REFERENCES users(idusers),
    FOREIGN KEY (products_idproducts) REFERENCES products(idproducts)
);


CREATE TABLE orders (
    idorder CHAR(36) PRIMARY KEY,
    total INT,
    origin VARCHAR(45),
    comments VARCHAR(45),
    client VARCHAR(45), 
    status TINYINT(1), 
    date DATETIME,
    start_order DATETIME,
    finish_order DATETIME,
    active TINYINT(1),
    users_idusers CHAR(36), 
    FOREIGN KEY (users_idusers) REFERENCES users(idusers)
);


CREATE TABLE order_details (
    idorderdetail CHAR(36) PRIMARY KEY,
    unit_price INT,
    order_type TINYINT(1),
    comments VARCHAR(45),
    order_idorder CHAR(36),
    products_idproducts CHAR(36),
    FOREIGN KEY (order_idorder) REFERENCES orders(idorder),
    FOREIGN KEY (products_idproducts) REFERENCES products(idproducts)
);


CREATE TABLE ingredients (
    idingredients CHAR(36) PRIMARY KEY,
    name VARCHAR(45),
    extra TINYINT(1),
    cost INT,
    stock INT,
    required TINYINT(1),
    active TINYINT(1),
    category_idcategory CHAR(36),
    FOREIGN KEY (category_idcategory) REFERENCES category(idcategory)
);


CREATE TABLE products_ingredients (
    idproducts_ingredients CHAR(36) PRIMARY KEY,
    ingredients_idingredients CHAR(36),
    products_idproducts CHAR(36),
    FOREIGN KEY (ingredients_idingredients) REFERENCES ingredients(idingredients),
    FOREIGN KEY (products_idproducts) REFERENCES products(idproducts)
);


CREATE TABLE not_ingredients (
    id_not_ingredient INT AUTO_INCREMENT PRIMARY KEY, 
    type TINYINT(1),
    ingredients_idingredients CHAR(36),
    order_details_idorderdetail CHAR(36),
    FOREIGN KEY (ingredients_idingredients) REFERENCES ingredients(idingredients),
    FOREIGN KEY (order_details_idorderdetail) REFERENCES order_details(idorderdetail)
);


SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE not_ingredients;
TRUNCATE TABLE products_ingredients;
TRUNCATE TABLE order_details;
TRUNCATE TABLE orders;
TRUNCATE TABLE favorites;
TRUNCATE TABLE products;
TRUNCATE TABLE ingredients;
TRUNCATE TABLE category;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;


-- Pass: password123 contraseña de prueba
INSERT INTO users (idusers, name, password, phone, rol) VALUES 
('usr-admin-001', 'Administrador', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxwKc.60MHJ65NE.B82Qy1K.k/vua', '5551111111', 0),
('usr-chef-001', 'Chef Ramsey', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxwKc.60MHJ65NE.B82Qy1K.k/vua', '5552222222', 2),
('usr-client-001', 'Juan Perez', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxwKc.60MHJ65NE.B82Qy1K.k/vua', '5553333333', 3),
('usr-client-002', 'Maria Lopez', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxwKc.60MHJ65NE.B82Qy1K.k/vua', '5554444444', 3);


INSERT INTO category (idcategory, name) VALUES 
('da99cc44-03a0-457a-8711-4660c3b5b45b', 'Hamburguesas'), 
('64afaea8-be6c-49ae-8e99-32132dd89630', 'Alitas'),
('4716bb4e-0793-4c76-9b48-3dd8e7a9ba9a', 'Snacks'),
('cat-drinks-001', 'Bebidas');


INSERT INTO ingredients (idingredients, name, extra, cost, stock, required, active, category_idcategory) VALUES 
('ing-carne', 'Carne', 0, 15, 100, 1, 1, 'da99cc44-03a0-457a-8711-4660c3b5b45b'),
('ing-queso', 'Queso', 1, 5, 50, 0, 1, 'da99cc44-03a0-457a-8711-4660c3b5b45b'),
('ing-tocino', 'Tocino', 1, 8, 50, 0, 1, 'da99cc44-03a0-457a-8711-4660c3b5b45b'),
('ing-cebolla', 'Cebolla', 0, 2, 40, 0, 1, 'da99cc44-03a0-457a-8711-4660c3b5b45b'),
('ing-lechu', 'Lechuga', 0, 2, 40, 0, 1, 'da99cc44-03a0-457a-8711-4660c3b5b45b'),
('ing-piña', 'Piña', 1, 5, 30, 0, 1, 'da99cc44-03a0-457a-8711-4660c3b5b45b'),
('ing-aguacate', 'Aguacate', 1, 10, 30, 0, 1, 'da99cc44-03a0-457a-8711-4660c3b5b45b'),
('ing-jamon', 'Jamon', 0, 5, 50, 0, 1, 'da99cc44-03a0-457a-8711-4660c3b5b45b'),
('ing-jitomate', 'Jitomate', 0, 3, 50, 0, 1, 'da99cc44-03a0-457a-8711-4660c3b5b45b'),
('ing-mayonesa', 'Mayonesa', 0, 2, 100, 0, 1, 'da99cc44-03a0-457a-8711-4660c3b5b45b'),
('ing-mostaza', 'Mostaza', 0, 2, 100, 0, 1, 'da99cc44-03a0-457a-8711-4660c3b5b45b'),
('ing-catsup', 'Catsup', 0, 2, 100, 0, 1, 'da99cc44-03a0-457a-8711-4660c3b5b45b'),
('ing-papas', 'Orden de papas', 0, 35, 100, 1, 1, '4716bb4e-0793-4c76-9b48-3dd8e7a9ba9a');


INSERT INTO products (idproducts, name, price, description, active, category_idcategory) VALUES 
('prod-hamb-01', 'Hamburguesa Clásica', 80, 'Carne, queso y vegetales frescos', 1, 'da99cc44-03a0-457a-8711-4660c3b5b45b'),
('prod-hamb-02', 'Hamburguesa Hawaiana', 95, 'Con piña asada y extra jamón', 1, 'da99cc44-03a0-457a-8711-4660c3b5b45b'),
('prod-hamb-03', 'Hamburguesa Doble', 120, 'Doble carne, doble queso, doble sabor', 1, 'da99cc44-03a0-457a-8711-4660c3b5b45b'),
('prod-alit-01', 'Alitas', 110, 'Orden de 5 bañadas en salsa BBQ', 1, '64afaea8-be6c-49ae-8e99-32132dd89630'),
('prod-snack-01', 'Orden de papas', 45, 'Crujientes y doradas', 1, '4716bb4e-0793-4c76-9b48-3dd8e7a9ba9a'),
('prod-snack-02', 'Nuggets de pollo', 55, '6 piezas con aderezo', 1, '4716bb4e-0793-4c76-9b48-3dd8e7a9ba9a'),
('prod-snack-03', 'Orden de salchipapas', 60, 'Lo mejor de dos mundos', 1, '4716bb4e-0793-4c76-9b48-3dd8e7a9ba9a'),
('prod-snack-04', 'Banderilla', 25, 'Clásica de feria', 1, '4716bb4e-0793-4c76-9b48-3dd8e7a9ba9a'),
('prod-drink-01', 'Refresco', 25, 'Coca-Cola, Fanta o Sprite', 1, 'cat-drinks-001'),
('prod-drink-02', 'Agua', 15, 'Natural embotellada', 1, 'cat-drinks-001');


INSERT INTO products_ingredients (idproducts_ingredients, ingredients_idingredients, products_idproducts) VALUES 
('pi-01', 'ing-carne', 'prod-hamb-01'), ('pi-02', 'ing-queso', 'prod-hamb-01'), ('pi-03', 'ing-lechu', 'prod-hamb-01'), ('pi-03a', 'ing-jitomate', 'prod-hamb-01'),
('pi-04', 'ing-carne', 'prod-hamb-02'), ('pi-05', 'ing-piña', 'prod-hamb-02'), ('pi-06', 'ing-queso', 'prod-hamb-02'), ('pi-06a', 'ing-jamon', 'prod-hamb-02'),
('pi-09', 'ing-papas', 'prod-snack-01'),
('pi-10', 'ing-catsup', 'prod-snack-01'),
('pi-11', 'ing-mayonesa', 'prod-snack-03');


INSERT INTO favorites (users_idusers, products_idproducts) VALUES 
('usr-client-001', 'prod-hamb-02'), 
('usr-client-001', 'prod-snack-03');

-- Estados: 0:Solicitada, 1:Cocina, 2:Lista, 3:Completada, 4:Cancelada
INSERT INTO orders (idorder, total, origin, comments, client, status, date, active, users_idusers) VALUES 
('ord-001', 125, 'App', 'Sin cebolla', 'Juan Perez', 0, NOW(), 1, 'usr-client-001'),
('ord-002', 220, 'App', 'Extra salsa', 'Juan Perez', 1, DATE_SUB(NOW(), INTERVAL 30 MINUTE), 1, 'usr-client-001'),
('ord-003', 80, 'Mesa', '', 'Juan Perez', 2, DATE_SUB(NOW(), INTERVAL 1 HOUR), 1, 'usr-client-001'),
('ord-004', 300, 'App', 'Cumpleaños', 'Maria Lopez', 3, DATE_SUB(NOW(), INTERVAL 1 DAY), 1, 'usr-client-002'),
('ord-005', 110, 'App', '', 'Juan Perez', 3, DATE_SUB(NOW(), INTERVAL 2 DAY), 1, 'usr-client-001'),
('ord-006', 500, 'Barra', 'Mesa grande', 'Juan Perez', 4, DATE_SUB(NOW(), INTERVAL 3 DAY), 1, 'usr-client-001'),
('ord-007', 45, 'App', '', 'Juan Perez', 0, NOW(), 1, 'usr-client-001'),
('ord-008', 60, 'App', 'Para llevar', 'Juan Perez', 1, NOW(), 1, 'usr-client-001'),
('ord-009', 25, 'Barra', '', 'Maria Lopez', 2, NOW(), 1, 'usr-client-002'),
('ord-010', 150, 'App', 'Sin hielo', 'Juan Perez', 3, DATE_SUB(NOW(), INTERVAL 5 DAY), 1, 'usr-client-001'),
('ord-011', 200, 'Mesa', '', 'Juan Perez', 4, DATE_SUB(NOW(), INTERVAL 6 DAY), 1, 'usr-client-001');


INSERT INTO order_details (idorderdetail, unit_price, order_type, comments, order_idorder, products_idproducts) VALUES 
('det-001', 80, 1, '', 'ord-001', 'prod-hamb-01'),
('det-002', 45, 1, '', 'ord-001', 'prod-snack-01'),
('det-003', 110, 1, '', 'ord-002', 'prod-alit-01'),
('det-004', 110, 1, '', 'ord-002', 'prod-alit-01'),
('det-005', 80, 0, '', 'ord-003', 'prod-hamb-01'),
('det-006', 45, 1, '', 'ord-007', 'prod-snack-01'),
('det-007', 60, 0, '', 'ord-008', 'prod-snack-03');