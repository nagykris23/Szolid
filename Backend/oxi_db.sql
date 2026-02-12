CREATE DATABASE oxi_db;

USE oxi_db;

CREATE TABLE CATEGORIES (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO CATEGORIES (name) VALUES ('parfum'), ('dezodor'), ('csomag');

CREATE TABLE PRODUCTS (
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price INT NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES CATEGORIES(category_id)
);

INSERT INTO PRODUCTS (name, description, category_id, price, stock_quantity, image_url) VALUES
('The Man 01', 'Fás-fűszeres, kissé orientális, napsütötte bőrös illat...', 1, 4500, 10, 'the-man-01.jpg'),
('The Man 02', 'Friss, tiszta, bizsergően csábító, vizes, fougere illat...', 1, 4500, 10, 'the-man-02.jpg'),
('The Man 03', 'Dohány-vanilia, orientális-fűszeres...', 1, 4500, 10, 'the-man-03.jpg'),
('The Man 04', 'Aromás, friss, vizes, bársonyosan fás alapon...', 1, 4500, 10, 'the-man-04.jpg'),
('Angel', 'Friss gyümölcsös-virágos, boldog, vidám illat...', 1, 4500, 15, 'angel.jpg'),
('Paris', 'Púderes, vaniliás-ánizsos, ínyenc illat...', 1, 4500, 15, 'paris.jpg'),
('Love', 'Gyümölcsös-virágos, édes, szerelmes, romantikus...', 1, 4500, 15, 'love.jpg'),
('Spell', 'Púderes-gyümölcsös illat...', 1, 4500, 15, 'spell.jpg'),
('Körömvirág Deo', 'Oxi dezodorunk gyógynövényekkel...', 2, 5100, 20, 'koromvirag.jpg'),
('Feketekömény Deo', 'Oxi dezodorunk gyógynövényekkel...', 2, 5100, 20, 'feketekomeny.jpg'),
('Cubeba Deo', 'Oxi dezodorunk gyógynövényekkel...', 2, 5100, 20, 'cubeba.jpg'),
('Wintergreen Deo', 'Oxi dezodorunk gyógynövényekkel...', 2, 5100, 20, 'wintergreen.jpg'),
('Parfüm csomag férfiaknak 3db', 'A csomag tartalma: The Man 01, 02, 03.', 3, 12000, 10, 'ferfi-csomag.jpg'),
('Parfüm csomag nőknek 3db', 'A csomag tartalma: Angel, Spring, Spell.', 3, 12000, 10, 'noi-csomag.jpg'),
('Családi dezodor csomag', 'A csomag tartalma: 1 férfi + 1 női + 1 tini.', 3, 13500, 10, 'deo-csomag.jpg');

CREATE TABLE USERS (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO USERS (name, email, password_hash, role) VALUES
('Admin User', 'admin@oxiessence.com', '$2a$10$GGWOS0dbLV8dfCBjKsP6ruzG04.kOsV75h2sygFH/.auzJ4ujT65K', 'admin'),
('Teszt User', 'teszt@oxiessence.com', '$2a$10$GGWOS0dbLV8dfCBjKsP6ruzG04.kOsV75h2sygFH/.auzJ4ujT65K', 'user');

CREATE TABLE ADDRESSES (
  address_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'Magyarország',
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  street_address VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE
);

CREATE TABLE ORDERS (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  address_id INT,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_amount INT NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  shipping_method VARCHAR(100),
  payment_method VARCHAR(100),
  payment_status ENUM('unpaid', 'paid', 'refunded') DEFAULT 'unpaid',
  FOREIGN KEY (user_id) REFERENCES USERS(user_id),
  FOREIGN KEY (address_id) REFERENCES ADDRESSES(address_id) ON DELETE SET NULL
);

CREATE TABLE ORDER_ITEMS (
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price_at_purchase INT NOT NULL, -- az eladáskori ár
  PRIMARY KEY (order_id, product_id),
  FOREIGN KEY (order_id) REFERENCES ORDERS(order_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES PRODUCTS(product_id)
);