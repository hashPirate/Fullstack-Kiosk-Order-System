from dotenv import load_dotenv
import os
import psycopg

# Load password from .env
load_dotenv()
db_password = os.getenv("DB_PASSWORD")

# Create the cursor
connection = psycopg.connect(f"dbname=group_6_db user=group_6 password={db_password} host=csce-315-db.engr.tamu.edu port=5432")
cursor = connection.cursor()

print("Creating new 'users' table...")
create_table_query = """
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    scopes TEXT[] NOT NULL DEFAULT '{}',
    on_staff BOOLEAN NOT NULL DEFAULT FALSE,
    gaia_id VARCHAR(255) UNIQUE
);
"""
cursor.execute(create_table_query)
print("'users' table created or already exists.")

print("Fetching users from 'pos_users'...")
cursor.execute("SELECT username, password_hash, is_manager, on_staff FROM pos_users;")
pos_users = cursor.fetchall()
print(f"Found {len(pos_users)} users to migrate.")

users_to_insert = []
for user in pos_users:
    username, password_hash, is_manager, on_staff = user
    scopes = ['cashier']
    if is_manager:
        scopes.append('manager')
    
    # (username, password_hash, scopes, on_staff)
    users_to_insert.append((username, password_hash, scopes, on_staff))

if users_to_insert:
    print("Migrating users to the new 'users' table...")
    with cursor.copy("COPY users (username, password_hash, scopes, on_staff) FROM STDIN") as copy:
        for record in users_to_insert:
            copy.write_row(record)
    print("Migration complete.")

connection.commit()
print("Changes committed.")