
import random
from dotenv import load_dotenv
import os
import psycopg
import datetime

# The command
# psql -h csce-315-db.engr.tamu.edu -p 5432 -U group_6 -d group_6_db

load_dotenv()
db_password = os.getenv("DB_PASSWORD")

connection = psycopg.connect(f"dbname=group_6_db user=group_6 password={db_password} host=csce-315-db.engr.tamu.edu port=5432")
cursor = connection.cursor()

insert_and_print_query = lambda query: (print(query),cursor.execute(query))

cursor.execute("SELECT * from menu_items;")
menu_items = cursor.fetchall() # (menu_item_id, item_name, price, for_sale)
cursor.execute("SELECT * from menu_parts;")
menu_parts = cursor.fetchall() # (part_item_id, part_name, price, for_sale)

menu_parts_for_menu_item = {
    "Bowl": ["Orange Chicken", "Grilled Teriyaki Chicken", "Beijing Beef", "Broccoli Beef", "Kung Pao Chicken", "Mushroom Chicken", "Sweetfire Chicken Breast", "String Bean Chicken", "Honey Walnut Shrimp"],
    "Plate": ["Orange Chicken","Grilled Teriyaki Chicken", "Beijing Beef", "Broccoli Beef", "Kung Pao Chicken", "Mushroom Chicken", "Sweetfire Chicken Breast", "String Bean Chicken", "Honey Walnut Shrimp"],
    "Big Plate": ["Orange Chicken", "Grilled Teriyaki Chicken", "Beijing Beef", "Broccoli Beef", "Kung Pao Chicken", "Mushroom Chicken", "Sweetfire Chicken Breast", "String Bean Chicken", "Honey Walnut Shrimp"],
    "Appetizer": ["Egg Roll", "Spring Roll", "Cream Cheese Rangoon"],
    "Drinks": ["Coca Cola", "Sprite", "Dr. Pepper", "Mountain Dew", "Fanta Orange", "Fanta Strawberry", "Hi-C", "Iced Tea"]
}

from_date = datetime.date(2024,9,1)

special_days = [
    datetime.date(2024,12,25),
    datetime.date(2025,1,1)
]

for day in range(365):
    from_date += datetime.timedelta(days=1)
    
    is_weekend = from_date.weekday() >= 5
    is_special_day = from_date in special_days
    
    # Orders per day
    order_count = random.randint(200,400)
    if is_weekend:
        order_count = int(order_count * 1.5)
        
    if is_special_day:
        order_count *= 8
    
    print(order_count)
    
    multiple_orders = []
    # Insert each order with a unique time.
    # We will not mind order IDs not being in actual chronological order, as we will order by created_at
    for _ in range(order_count):
        random_hour = random.randint(10,20)
        random_minute = random.randint(0,59)
        random_second = random.randint(0,59)
        random_cook_time = random.randint(5,9)
        
        date_with_hour = datetime.datetime(from_date.year, from_date.month, from_date.day, random_hour, random_minute, random_second)
        # [Donnell]: made sure cooked_at and is_cooked are populated.
        multiple_orders.append(f"('{date_with_hour}', TRUE, {date_with_hour + datetime.timedelta(minutes=random_cook_time)}), TRUE")
    
    multiple_orders = ", ".join(multiple_orders)
    print(multiple_orders)
    insert_and_print_query(f"INSERT INTO orders (created_at, is_final, cooked_at, is_cooked) VALUES {multiple_orders}\nRETURNING order_id, created_at;")
    orders = cursor.fetchall()
    
    multiple_order_items = []
    
    parsed_order_time_to_part_ids = {}
    
    # Each order from fetchall comes out like this: ((order_id, timestamp),), which basically are double nested tuples
    for order_id, timestamp in orders:
        # Each order can have from 1 to 4 items.
        order_item_count = random.randint(1,4)
        
        # Each order item will start from when the order was created.
        parsed_order_time = datetime.datetime.strptime(str(timestamp), '%Y-%m-%d %H:%M:%S')
        
        # If it's a family, triple the order.
        is_family = random.randint(0,100) > 80
        if is_family:
            order_item_count *= 3
        
        for _ in range(order_item_count):
            # Add a random amount of seconds to parsed_order_time
            parsed_order_time += datetime.timedelta(seconds=random.randint(0,30))
            
            # Pick a menu item, and add a menu part that works for the item
            menu_item = random.choice(menu_items)
            menu_parts_for_menu_item[menu_item[1]]
            menu_part_name = random.choice(menu_parts_for_menu_item[menu_item[1]])
            menu_part = [mp for mp in menu_parts if mp[1] == menu_part_name][0]
            
            # Make a new order entry
            quantity = random.randint(1,3)
            
            order_item = f"({order_id}, {menu_item[0]}, '{parsed_order_time}', {quantity}, {menu_item[2] + menu_part[2]})"
            multiple_order_items.append(order_item)
            parsed_order_time_to_part_ids[parsed_order_time] = [menu_part[0]]
        
    multiple_order_items = ", ".join(multiple_order_items)
    insert_and_print_query(f"INSERT INTO order_items (order_id, menu_item_id, created_at, quantity, current_price) VALUES {multiple_order_items}\nRETURNING order_item_id, created_at;")
    
    order_item_id_and_menu_item_ids = cursor.fetchall()
    print(order_item_id_and_menu_item_ids)
    
    junction_list = []
    for order_item_id, order_item_time in order_item_id_and_menu_item_ids:
        for menu_part_id in parsed_order_time_to_part_ids[order_item_time]:
            junction_list.append(f"({order_item_id}, {menu_part_id})")
        
    junction_list = ", ".join(junction_list)
    
    # Add menu parts to order entry
    insert_and_print_query(f"INSERT INTO menu_parts_to_order_items (order_item_id, menu_part_id) VALUES {junction_list};")
    
if input("Commit changes? Enter y to perform: ") == "y":
    connection.commit()