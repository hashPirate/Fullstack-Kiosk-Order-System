CREATE TABLE "users" (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    scopes TEXT[] NOT NULL DEFAULT '{}',
    on_staff BOOLEAN NOT NULL DEFAULT FALSE,
    gaia_id VARCHAR(255) UNIQUE
);

CREATE TABLE "menu_items" (
    menu_item_id SERIAL PRIMARY KEY,
    item_name VARCHAR,
    price REAL,
    for_sale BOOLEAN
);

CREATE TABLE "menu_parts" (
    menu_part_id SERIAL PRIMARY KEY,
    part_name VARCHAR,
    price REAL,
    for_sale BOOLEAN
);

CREATE TABLE "ingredients" (
    ingredient_id SERIAL PRIMARY KEY,
    name VARCHAR,
    current_quantity INTEGER,
    quantity_unit VARCHAR,
    alert_threshold   INTEGER
);

CREATE TABLE "orders" (
    order_id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    is_final BOOLEAN,
    is_cooked BOOLEAN
);

CREATE TABLE "ingredients_to_menu_parts" (
    ingredient_to_part SERIAL PRIMARY KEY,
    ingredient_id INTEGER REFERENCES "ingredients" (ingredient_id),
    menu_part_id INTEGER REFERENCES "menu_parts" (menu_part_id),
    quantity_cost INTEGER
);

CREATE TABLE "order_items" (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES "orders" (order_id),
    menu_item_id INTEGER REFERENCES "menu_items" (menu_item_id),
    created_at TIMESTAMP NOT NULL,
    quantity INTEGER,
    current_price REAL
);

CREATE TABLE "menu_parts_to_order_items" (
    menu_parts_to_order_items_id SERIAL PRIMARY KEY,
    order_item_id INTEGER REFERENCES "order_items" (order_item_id),
    menu_part_id INTEGER REFERENCES "menu_parts" (menu_part_id)
);