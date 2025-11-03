-- This is in reverse order of dependencies to avoid foreign key constraint issues

DROP TABLE IF EXISTS "menu_parts_to_order_items";
DROP TABLE IF EXISTS "order_items";
DROP TABLE IF EXISTS "ingredients_to_menu_parts";
DROP TABLE IF EXISTS "pos_users";
DROP TABLE IF EXISTS "menu_items";
DROP TABLE IF EXISTS "menu_parts";
DROP TABLE IF EXISTS "ingredients";
DROP TABLE IF EXISTS "orders";