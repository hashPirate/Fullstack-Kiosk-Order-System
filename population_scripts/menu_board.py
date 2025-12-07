from dotenv import load_dotenv
import os
import psycopg

load_dotenv()
db_password = os.getenv("DB_PASSWORD")

connection = psycopg.connect(f"dbname={db_name} user={db_user} password={db_password} host={db_host} port={db_port}")
cursor = connection.cursor()

print("Fetching table menu_board_items")
cursor.execute("""
CREATE TABLE IF NOT EXISTS menu_board_items (
menu_board_item_id SERIAL PRIMARY KEY, section TEXT NOT NULL, item_name TEXT NOT NULL, calories INTEGER,calorie_range TEXT,description TEXT,
price NUMERIC(10,2));""")
print("Table exists.")

print("Deleting existing data from menu_board_items...")
cursor.execute("TRUNCATE menu_board_items RESTART IDENTITY;")

print("Inserting sides into the table")
cursor.execute("""
INSERT INTO menu_board_items (section, item_name, calories) 
VALUES('sides', 'Beijing Beef', 470),('sides', 'Broccoli Beef', 150),('sides', 'Cream Cheese Rangoon', 190),('sides', 'Egg Roll', 190),('sides', 'Grilled Teriyaki Chicken', 280),
('sides', 'Honey Walnut Shrimp', 400),('sides', 'Kung Pao Chicken', 290),('sides', 'Mushroom Chicken', 450),('sides', 'Orange Chicken', 490),('sides', 'Sweetfire Chicken Breast', 380);""")


print("Inserting base items into the table")
cursor.execute("""
INSERT INTO menu_board_items (section, item_name, calories)
VALUES ('base', 'Chow Mein', 510),('base', 'Fried Rice', 520);""")

print("Inserting drinks into the table")
cur.execute("""
INSERT INTO menu_board_items (section, item_name, calorie_range, price)
VALUES ('drinks', 'Bottled Drinks', '0-320 cals', 2.20),('drinks', 'Iced Tea', '0 cals', 2.10),('drinks', 'Fountain', '0–510 cals', 1.90);""")


print("Inserting meals into the table")
cur.execute("""
INSERT INTO menu_board_items (section, item_name, calorie_range, description, price)
VALUES ('meals', 'Bowl', '0–320 cals', '1 Base & 1 Side', 6.40), ('meals', 'Plate', '0–320 cals', '1 Base & 2 Side', 7.90),('meals', 'Bigger Plate', '0–320 cals', '1 Base & 3 Side', 9.20);""")

if input("Commit changes? Enter y to perform: ") == "y":
    conn.commit()
    print("Changes committed")
else:
    conn.rollback()
    print("No changes saved")

cur.close()
conn.close()

