
from dotenv import load_dotenv
import os
import psycopg

# The command
# psql -h csce-315-db.engr.tamu.edu -p 5432 -U group_6 -d group_6_db

load_dotenv()
db_password = os.getenv("DB_PASSWORD")

connection = psycopg.connect(f"dbname=group_6_db user=group_6 password={db_password} host=csce-315-db.engr.tamu.edu port=5432")
cursor = connection.cursor()

cursor.execute("SELECT * from menu_parts_to_order_items;")
print(cursor.fetchall())
cursor.execute("SELECT * from order_items;")
print(cursor.fetchall())
cursor.execute("SELECT * from ingredients_to_menu_parts;")
print(cursor.fetchall())
cursor.execute("SELECT * from pos_users;")
print(cursor.fetchall())
cursor.execute("SELECT * from menu_items;")
print(cursor.fetchall())
cursor.execute("SELECT * from menu_parts;")
print(cursor.fetchall())
cursor.execute("SELECT * from ingredients;")
print(cursor.fetchall())
cursor.execute("SELECT * from orders;")
print(cursor.fetchall())