# Columns:
#  user_id       | integer           |           | not null | nextval('pos_users_user_id_seq'::regclass)
#  username      | character varying |           |          |
#  has_password  | boolean           |           |          |
#  password_hash | character varying |           |          |
#  is_manager    | boolean           |           |          |

from dotenv import load_dotenv
import os
import psycopg

# Load password from .env
load_dotenv()
db_password = os.getenv("DB_PASSWORD")

# Create the cursor
connection = psycopg.connect(f"dbname=group_6_db user=group_6 password={db_password} host=csce-315-db.engr.tamu.edu port=5432")
cursor = connection.cursor()

# Add the users
cursor.execute("INSERT INTO pos_users(username, password_hash, is_manager, on_staff) VALUES ('Shawna', '', TRUE, FALSE);")
cursor.execute("INSERT INTO pos_users(username, password_hash, is_manager, on_staff) VALUES ('Liberato', '', TRUE, FALSE);")
cursor.execute("INSERT INTO pos_users(username, password_hash, is_manager, on_staff) VALUES ('Jerry', '', FALSE, FALSE);")
cursor.execute("INSERT INTO pos_users(username, password_hash, is_manager, on_staff) VALUES ('Matthew', '', FALSE, FALSE);")
cursor.execute("INSERT INTO pos_users(username, password_hash, is_manager, on_staff) VALUES ('Quandale', '', FALSE, FALSE);")

# Check status
cursor.execute("SELECT * FROM pos_users;")
print(cursor.fetchall())

# Need this to save changes!
connection.commit()
