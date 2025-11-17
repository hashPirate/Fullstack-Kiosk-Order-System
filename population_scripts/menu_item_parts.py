from dotenv import load_dotenv
import os
import psycopg

# Load password from .env
load_dotenv()
db_password = os.getenv("DB_PASSWORD")

# Create the cursor
connection = psycopg.connect(f"dbname=group_6_db user=group_6 password={db_password} host=csce-315-db.engr.tamu.edu port=5432")
cursor = connection.cursor()

print("Fetching menu items and parts...")
cursor.execute("SELECT menu_item_id, item_name FROM menu_items;")
menu_items = {item_name: item_id for item_id, item_name in cursor.fetchall()}

cursor.execute("SELECT menu_part_id, part_name FROM menu_parts;")
menu_parts = {part_name: part_id for part_id, part_name in cursor.fetchall()}
print("Finished fetching.")

# Based on orders.py
menu_parts_for_menu_item = {
    "Bowl": ["Orange Chicken", "Grilled Teriyaki Chicken", "Beijing Beef", "Broccoli Beef", "Kung Pao Chicken", "Mushroom Chicken", "Sweetfire Chicken Breast", "String Bean Chicken", "Honey Walnut Shrimp"],
    "Plate": ["Orange Chicken","Grilled Teriyaki Chicken", "Beijing Beef", "Broccoli Beef", "Kung Pao Chicken", "Mushroom Chicken", "Sweetfire Chicken Breast", "String Bean Chicken", "Honey Walnut Shrimp"],
    "Big Plate": ["Orange Chicken", "Grilled Teriyaki Chicken", "Beijing Beef", "Broccoli Beef", "Kung Pao Chicken", "Mushroom Chicken", "Sweetfire Chicken Breast", "String Bean Chicken", "Honey Walnut Shrimp"],
    "Appetizer": ["Egg Roll", "Spring Roll", "Cream Cheese Rangoon"],
    "Drinks": ["Coca Cola", "Sprite", "Dr. Pepper", "Mountain Dew", "Fanta Orange", "Fanta Strawberry", "Hi-C", "Iced Tea"]
}

junction_list = []
for item_name, part_names in menu_parts_for_menu_item.items():
    if item_name in menu_items:
        item_id = menu_items[item_name]
        for part_name in part_names:
            if part_name in menu_parts:
                part_id = menu_parts[part_name]
                junction_list.append((item_id, part_id))

if junction_list:
    print(f"Inserting {len(junction_list)} menu item to menu part relationships...")
    with cursor.copy("COPY menu_parts_to_menu_items (menu_item_id, menu_part_id) FROM STDIN") as copy:
        for record in junction_list:
            copy.write_row(record)
    print("Insertion complete.")

if input("Commit changes? Enter y to perform: ") == "y":
    connection.commit()
    print("Changes committed.")