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
('The Man 01', 'Fás-fűszeres, kissé orientális, napsütötte bőrös illat, ami csakis olyan férfinak áll jól, aki szereti a kalandot, nem fél kockáztatni, megragad minden lehetőséget.', 'parfum', 4500, 10, 'the-man-01.jpg'),
('The Man 02', ' Friss, tiszta, bizsergően csábító, vizes, fougere illat. A férfié, aki most lépett ki a zuhany alól. Főként a tölgymoha és a levendula aromáit egyesíti.', 'parfum', 4500, 10, 'the-man-02.jpg'),
('The Man 03', 'Dohány-vanilia, orientális-fűszeres. Izgalmas, erőteljes aromája a hatalom és magabiztosság érzésével ruház fel. Klasszikus, nagyon férfias illat.', 'parfum', 4500, 10, 'the-man-03.jpg'),
('The Man 04', 'Aromás, friss, vizes, bársonyosan fás alapon. Az illat nagyon energikus, magával ragadó! Erő, dinamizmus, népszerűség. A győztes, sikeres, mindenre elszánt, célorientált hős illata!', 'parfum', 4500, 10, 'the-man-04.jpg'),

('Angel', 'Friss gyümölcsös-virágos, boldog, vidám illat. Merész, csacsogó, nyílt, fiatalos.', 'parfum', 4500, 15, 'angel.jpg'),
('Paris', 'Púderes, vaniliás-ánizsos, ínyenc illat. Friss, tiszta,előkelő. A természetes, stílusos, elegáns nő illata.', 'parfum', 4500, 15, 'paris.jpg'),
('Love', 'Gyümölcsös-virágos, édes, szerelmes, romantikus, szenvedélyes, álmokkal teli illat.', 'parfum', 4500, 15, 'love.jpg'),
('Spell', 'Púderes-gyümölcsös illat. A fantázia világába repítő, édes, bájos, belevaló, igazi csajos illat.', 'parfum', 4500, 15, 'spell.jpg'),

('Körömvirág Deo', 'Oxi dezodorunk a benne lévő gyógynövényekkel, ezüstkolloiddal és cink oxiddal egyedülálló formulát alkot.', 'dezodor', 5100, 20, 'koromvirag.jpg'),
('Feketekömény Deo', 'Oxi dezodorunk a benne lévő gyógynövényekkel, ezüstkolloiddal és cink oxiddal egyedülálló formulát alkot.', 'dezodor', 5100, 20, 'feketekomeny.jpg'),
('Cubeba Deo', 'Oxi dezodorunk a benne lévő gyógynövényekkel, ezüstkolloiddal és cink oxiddal egyedülálló formulát alkot.', 'dezodor', 5100, 20, 'cubeba.jpg'),
('Wintergreen Deo', 'Oxi dezodorunk a benne lévő gyógynövényekkel, ezüstkolloiddal és cink oxiddal egyedülálló formulát alkot.', 'dezodor', 5100, 20, 'wintergreen.jpg'),

('Parfüm csomag férfiaknak 3db', 'A csomag tartalma: The Man 01, The Man 02, The Man 03.', 'csomag', 12000, 10, 'ferfi-csomag.jpg'),
('Parfüm csomag nőknek 3db', 'A csomag tartalma: Angel, Spring. Spell.', 'csomag', 12000, 10, 'noi-csomag.jpg'),
('Családi dezodor csomag', 'A csomag tartalma: 1 férfi + 1 női + 1 tini dezodor.', 'csomag', 13500, 10, 'deo-csomag.jpg');

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
('Admin User', 'admin@oxiessence.com', '$2a$10$GGWOS0dbLV8dfCBjKsP6ruzG04.kOsV75h2sygFH/.auzJ4ujT65K', 'admin'),
('Teszt User', 'teszt@oxiessence.com', '$2a$10$GGWOS0dbLV8dfCBjKsP6ruzG04.kOsV75h2sygFH/.auzJ4ujT65K', 'user');


SELECT user_id, email, password_hash, LENGTH(password_hash) AS len
FROM USERS
WHERE email = 'admin@example.com';