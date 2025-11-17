from dotenv import load_dotenv
import os
import psycopg

# Load password from .env
load_dotenv()
db_password = os.getenv("DB_PASSWORD")

# Create the cursor
connection = psycopg.connect(f"dbname=group_6_db user=group_6 password={db_password} host=csce-315-db.engr.tamu.edu port=5432")
cursor = connection.cursor()

# Define the users to be added
users_to_insert = [
    # username, password_hash, scopes, on_staff
    ('Shawna', '', ['cashier', 'manager'], False),
    ('Liberato', '', ['cashier', 'manager'], False),
    ('Jerry', '', ['cashier'], False),
    ('Matthew', '', ['cashier'], False),
    ('Quandale', '', ['cashier'], False)
]

print("Inserting users into the 'users' table...")
with cursor.copy("COPY users (username, password_hash, scopes, on_staff) FROM STDIN") as copy:
    for record in users_to_insert:
        copy.write_row(record)
print(f"{len(users_to_insert)} users inserted.")

# Check status
cursor.execute("SELECT user_id, username, scopes, on_staff FROM users;")
print(cursor.fetchall())

# Need this to save changes!
connection.commit()
