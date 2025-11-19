from dotenv import load_dotenv
import os
import psycopg

import json
import re
from pathlib import Path

# The command
# psql -h csce-315-db.engr.tamu.edu -p 5432 -U group_6 -d group_6_db

IMAGES_PATH = (
    Path(__file__).resolve().parents[1] / "frontend" / "public" / "menu_images"
)
MENU_IMAGE_UPLOAD = IMAGES_PATH / "image_upload.json"
IMAGE_JPG_EXTENSION = ".jpg"
IMAGE_PNG_EXTENSION = ".png"


def convertToKebabCase(itemName):
    itemName = itemName.lower()
    itemName = re.sub(r"[^a-z0-9]+", "-", itemName)
    itemName = itemName.strip("-")
    return itemName


load_dotenv()
db_password = os.getenv("DB_PASSWORD")
connection = psycopg.connect(
    f"dbname=group_6_db user=group_6 password={db_password} host=csce-315-db.engr.tamu.edu port=5432"
)
cursor = connection.cursor()

image_upload = {}

cursor.execute("SELECT item_name FROM menu_items;")
menu_items = [i[0] for i in cursor.fetchall()]

for menu_item in menu_items:
    filename = convertToKebabCase(menu_item) + IMAGE_JPG_EXTENSION
    image_upload[menu_item] = f"/menu_images/{filename}"
    
    # Set image name in database
    cursor.execute(
        "UPDATE menu_items SET image_name = %s WHERE item_name = %s;",
        (filename, menu_item),
    )

cursor.execute("SELECT part_name FROM menu_parts;")
menu_parts = [i[0] for i in cursor.fetchall()]

for menu_part in menu_parts:
    filename = convertToKebabCase(menu_part) + IMAGE_JPG_EXTENSION
    image_upload[menu_part] = f"/menu_images/{filename}"
    
    # Set image name in database
    cursor.execute(
        "UPDATE menu_parts SET image_name = %s WHERE part_name = %s;",
        (filename, menu_part),
    )

with open(MENU_IMAGE_UPLOAD, "w", encoding="utf-8") as f:
    json.dump(image_upload, f, indent=4)
    
# Find what images exist in IMAGES_PATH, and upload them to the images table.
image_records = []
for filename in os.listdir(IMAGES_PATH):
    if filename.endswith(IMAGE_JPG_EXTENSION) or filename.endswith(IMAGE_PNG_EXTENSION):
        image_name = filename
        with open(IMAGES_PATH / filename, "rb") as f:
            image_data = f.read()
            image_records.append((image_name, image_data))

if image_records:
    print(f"Inserting {len(image_records)} images into the 'images' table...")
    # Delete records if they exist already
    for record in image_records:
        cursor.execute("DELETE FROM images WHERE image_name = %s;", (record[0],))
    
    with cursor.copy("COPY images (image_name, image_data) FROM STDIN (FORMAT BINARY)") as copy:
        for record in image_records:
            copy.write_row(record)
    
    print("Image insertion complete.")
else:
    print("No images found to insert.")

if input("Commit changes? Enter y to perform: ") == "y":
    connection.commit()
    print("Changes committed.")
    
cursor.close()
connection.close()
