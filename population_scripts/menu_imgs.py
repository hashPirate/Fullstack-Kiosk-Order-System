
from dotenv import load_dotenv
import os
import psycopg

import json
import re
from pathlib import Path
# The command
# psql -h csce-315-db.engr.tamu.edu -p 5432 -U group_6 -d group_6_db

IMAGES_PATH=Path(__file__).resolve().parents[1]/"frontend"/"public"/"menu_images"
MENU_IMAGE_UPLOAD=IMAGES_PATH/"image_upload.json"
IMAGE_EXTENSION=".jpg"
def stringFormat(itemName):
    itemName=itemName.lower()
    itemName=re.sub(r"[^a-z0-9]+","-",itemName)
    itemName=itemName.strip("-")
    return itemName

load_dotenv()
db_password=os.getenv("DB_PASSWORD")
connection=psycopg.connect(f"dbname=group_6_db user=group_6 password={db_password} host=csce-315-db.engr.tamu.edu port=5432")
cursor=connection.cursor()

cursor.execute("SELECT part_name FROM menu_parts;")
menu_parts=[i[0] for i in cursor.fetchall()]
image_upload={}

for menuPart in menu_parts:
    filename=stringFormat(menuPart)+IMAGE_EXTENSION
    image_upload[menuPart]=f"/menu_images/{filename}"

with open(MENU_IMAGE_UPLOAD,"w",encoding="utf-8") as f:
    json.dump(image_upload,f,indent=4)
cursor.close()
connection.close()
