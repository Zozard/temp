-- First migration 

CREATE TYPE rarity AS ENUM ('⬧', '⬧⬧', '⬧⬧⬧', '⬧⬧⬧⬧', '★', '★★', '★★★', '👑');

CREATE TABLE cards
(
    id SERIAL PRIMARY KEY,
    card_id VARCHAR(100) NOT NULL,
    pokemon_name VARCHAR(100) NOT NULL,
    rarity rarity NOT NULL
);

CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    email VARCHAR(250) NOT NULL,
    pseudo VARCHAR(100),
    friend_code CHAR(19)
);

CREATE TYPE direction AS ENUM ('SELL', 'BUY');

CREATE TABLE user_cards 
(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users (id),
    card_id INT REFERENCES cards (id),
    direction direction NOT NULL,
    quantity INT NOT NULL,
    UNIQUE (user_id, card_id, direction)
);

-- Second Migration 

-- à venir 
-- les modifs sur les tables sont à faire avec des alter table 
-- (au sein de transactions dans l'idéal) 

-- 11/02-2025
ALTER TABLE cards RENAME COLUMN pokemon_name TO card_name;