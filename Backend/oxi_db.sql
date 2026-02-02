CREATE DATABASE oxi_db;

USE oxi_db;


CREATE TABLE PRODUCTS (
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  price INT NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO PRODUCTS (name, description, category, price, stock_quantity, image_url) VALUES
('The Man 02', 'Férfi szilárd parfüm, fás-fűszeres illat', 'parfum', 5000, 10, 'the-man-02.jpg'),
('Angel', 'Édes, virágos női szilárd parfüm', 'parfum', 4500, 15, 'angel.jpg'),
('Dezodor', 'Természetes szilárd dezodor', 'dezodor', 3500, 20, 'dezodor.jpg');

CREATE TABLE USERS (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*
JELSZO: password
*/
INSERT INTO USERS (name, email, password_hash, role) VALUES
('Admin User', 'admin@example.com', '$2a$10$GGWOS0dbLV8dfCBjKsP6ruzG04.kOsV75h2sygFH/.auzJ4ujT65K', 'admin'),
('Teszt User', 'user@example.com', '$2a$10$GGWOS0dbLV8dfCBjKsP6ruzG04.kOsV75h2sygFH/.auzJ4ujT65K', 'user');


SELECT user_id, email, password_hash, LENGTH(password_hash) AS len
FROM USERS
WHERE email = 'admin@example.com';