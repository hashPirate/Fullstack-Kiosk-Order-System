
from dotenv import load_dotenv
import os
import psycopg

# The command
# psql -h csce-315-db.engr.tamu.edu -p 5432 -U group_6 -d group_6_db

load_dotenv()
db_password = os.getenv("DB_PASSWORD")

connection = psycopg.connect(f"dbname=group_6_db user=group_6 password={db_password} host=csce-315-db.engr.tamu.edu port=5432")
cursor = connection.cursor()

insert_and_print_query = lambda query: (print(query),cursor.execute(query))

ingredients = [("Chicken", "Ounces", 1000),
               ("Beef", "Ounces", 1000),
               ("Broccoli", "Ounces", 1000),
               ("Shrimp", "Ounces", 1000),
               ("Peppers", "Units", 500),
               ("Zucchini", "Units", 500),
               ("Onions", "Units", 500),
               ("Mushrooms", "Ounces", 1000),
               ("String beans", "Ounces", 1000),
               ("Walnuts", "Ounces", 1000),
               ("Honey", "Ounces", 1000),
               ("Frozen egg rolls", "Units", 500),
               ("Frozen cream cheese rangoons", "Units", 500),
               ("Spices", "Grams", 1000),
               ("Teriyaki sauce", "Grams", 1000),
               ("Coca Cola", "Ounces", 1000),
               ("Sprite", "Ounces", 1000),
               ("Dr. Pepper", "Ounces", 1000),
               ("Mountain Dew", "Ounces", 1000),
               ("Fanta Orange", "Ounces", 1000),
               ("Iced Tea", "Ounces", 1000),
               ("Fanta Strawberry", "Ounces", 1000),
               ("Hi-C", "Ounces", 1000),
               ]

menu_parts = [("Orange Chicken", 0.00, True, ["Chicken", "Spices"]),
              ("Grilled Teriyaki Chicken", 1.50, True, ["Chicken", "Spices", "Teriyaki sauce"]),
              ("Beijing Beef", 2.50, True, ["Beef", "Spices"]),
              ("Broccoli Beef", 0.00, True, ["Beef", "Broccoli"]),
              ("Kung Pao Chicken", 0.00, True, ["Chicken", "Spices", "Peppers"]),
              ("Mushroom Chicken", 0.00, True, ["Chicken", "Mushrooms", "Zucchini"]),
              ("Sweetfire Chicken Breast", 0.00, True, ["Chicken", "Peppers", "Onions"]),
              ("String Bean Chicken", 0.00, True, ["Chicken", "Spices", "String beans"]),
              ("Honey Walnut Shrimp", 1.50, True, ["Shrimp", "Walnuts", "Honey"]),
              ("Egg Roll", 0.00, True, ["Frozen egg rolls"]),
              ("Spring Roll", 0.00, True, ["Frozen egg rolls"]),
              ("Cream Cheese Rangoon", 0.00, True, ["Frozen cream cheese rangoons"]),
              ("Coca Cola", 0.00, True, ["Coca Cola"]),
              ("Sprite", 0.00, True, ["Sprite"]),
              ("Dr. Pepper", 0.00, True, ["Dr. Pepper"]),
              ("Mountain Dew", 0.00, True, ["Mountain Dew"]),
              ("Fanta Orange", 0.00, True, ["Fanta Orange"]),
              ("Fanta Strawberry", 0.00, True, ["Fanta Strawberry"]),
              ("Hi-C", 0.00, True, ["Hi-C"]),
              ("Iced Tea", 0.00, True, ["Iced Tea"]),
              ]

menu_items = [("Bowl", 5.50, True),
              ("Plate", 7.50, True),
              ("Big Plate", 8.50, True),
              ('Appetizer', 3.50, True),
              ('Drinks', 2.50, True)]

if input("Insert Ingredients? Enter y to perform: ") == "y":
    ingredients_joined = ", ".join(["('{}', '{}', {})".format(ingredient[0], ingredient[1], ingredient[2]) for ingredient in ingredients])
    print(ingredients_joined)
    insert_and_print_query(f"INSERT INTO ingredients (name, quantity_unit, current_quantity) VALUES {ingredients_joined};")

if input("Insert Menu Parts? Enter y to perform: ") == "y":
    # First, we need to make a map of the ids for each ingredient.
    cursor.execute("SELECT * FROM ingredients;")
    ingredient_id_map = {}
    for ingredient in cursor.fetchall():
        ingredient_id_map[ingredient[1]] = ingredient[0]

    # Next, we can fill the menu_parts table with just the parts.
    menu_parts_joined = ", ".join(["('{}', {}, {})".format(mp[0], mp[1], mp[2]) for mp in menu_parts])
    print(menu_parts_joined)
    insert_and_print_query(f"INSERT INTO menu_parts (part_name, price, for_sale) VALUES {menu_parts_joined};")

    # Then we need a map of the ids for each menu part we just inserted.
    cursor.execute("SELECT * FROM menu_parts;")
    menu_part_id_map = {}
    for mp in cursor.fetchall():
        menu_part_id_map[mp[1]] = mp[0]

    # Finally, fill junction table ingredients_to_menu_parts.
    ingredients_to_menu_parts_joined = ", ".join(["({}, {})".format(menu_part_id_map[mp[0]], ingredient_id_map[ingredient]) for mp in menu_parts for ingredient in mp[3]])
    print(ingredients_to_menu_parts_joined)
    insert_and_print_query(f"INSERT INTO ingredients_to_menu_parts (menu_part_id, ingredient_id) VALUES {ingredients_to_menu_parts_joined};")

if input("Insert Menu Items? Enter y to perform: ") == "y":
    menu_items_joined = ", ".join(["('{}', {}, {})".format(mi[0], mi[1], mi[2]) for mi in menu_items])
    print(menu_items_joined)
    insert_and_print_query(f"INSERT INTO menu_items (item_name, price, for_sale) VALUES {menu_items_joined};")

if input("Commit changes? Enter y to perform: ") == "y":
    connection.commit()