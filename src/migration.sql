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

-- les modifs sur les tables sont à faire avec des alter table 
-- (au sein de transactions dans l'idéal) 

-- 11/02-2025
ALTER TABLE cards RENAME COLUMN pokemon_name TO card_name;

-- Troisième Migration
-- Mise en place des trade requests 

BEGIN;

CREATE TYPE trade_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'SEEN');

CREATE TABLE trade_requests (
    id SERIAL PRIMARY KEY,
    
    sender_id INT NOT NULL REFERENCES users(id),
    receiver_id INT NOT NULL REFERENCES users(id),

    offered_card_id INT NOT NULL REFERENCES cards(id),
    requested_card_id INT NOT NULL REFERENCES cards(id),

    status trade_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT NOW(),
    seen_at TIMESTAMP
);

COMMIT;

-- Quatrième Migration 
-- Pour empêcher le spam de notifications 

CREATE INDEX idx_trade_requests_status ON trade_requests(status);

CREATE UNIQUE INDEX unique_pending_seen_trade_requests
ON trade_requests (sender_id, receiver_id, offered_card_id, requested_card_id)
WHERE status IN ('PENDING', 'SEEN');

-- Cinquième Migration

-- Index d'unicité sur l'email des utilisateurs
-- Ajout d'une date de dernière connexion 

CREATE UNIQUE INDEX unique_user_email
ON users (email);

ALTER TABLE users ADD COLUMN last_seen_at TIMESTAMPTZ DEFAULT NOW();

-- Sixième Migration

-- Création de la table des groupes avec UUID et référence vers l'administrateur
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT gen_random_uuid(), -- UUID unique pour rejoindre le groupe
    name VARCHAR(100) NOT NULL,
    description TEXT,
    admin_id INT NOT NULL REFERENCES users(id), -- Référence vers l'administrateur unique
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Contrainte d'unicité sur l'UUID
    UNIQUE (uuid)
);

CREATE TABLE user_groups (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    group_id INT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT NOW(),
    
    -- Contrainte d'unicité pour éviter les doublons
    UNIQUE (user_id, group_id)
);

CREATE INDEX idx_user_groups_user_id ON user_groups(user_id);
CREATE INDEX idx_user_groups_group_id ON user_groups(group_id);
CREATE INDEX idx_groups_uuid ON groups(uuid); -- Index sur l'UUID pour les recherches rapides
CREATE INDEX idx_groups_admin ON groups(admin_id); -- Index sur l'administrateur

