-- create database and user

CREATE DATABASE nextjs_gym_app;
CREATE USER nextjs_gym_app WITH ENCRYPTED PASSWORD 'nextjs_gym_app';
GRANT PRIVILIGES ON DATABASE nextjs_gym_app TO nextjs_gym_app;
\connect nextjs_gym_app
CREATE SCHEMA nextjs_gym_app AUTHORIZATION nextjs_gym_app;

CREATE TABLE users (
id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
username VARCHAR(50) NOT NULL,
password VARCHAR(255) NOT NULL,
mail VARCHAR(50) NOT NULL,
age INTEGER NOT NULL,
mobile VARCHAR(50) NOT NULL,
is_shredding BOOLEAN NOT NULL,
is_bulking BOOLEAN NOT NULL,
is_experienced BOOLEAN NOT NULL
);

-- insert data

INSERT INTO users
(username, password, mail, age, mobile, is_shredding, is_bulking, is_experienced)
VALUES
('try', 'try', 'try@try.com', 99, '+43123456789', true, false, false);

--getting data

SELECT * FROM users;

--update data

UPDATE users
SET username = 'try2'
WHERE id = 1;
