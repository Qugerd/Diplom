import sqlite3
from PIL import Image
from io import BytesIO
import base64


PLACEHOLD_PATH = "http://placehold.it/150x150"

def CreateDataBase():
    conn = sqlite3.connect('database.db')
    conn.execute('''CREATE TABLE IF NOT EXISTS views
                (id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                img BLOB);''')
    conn.commit()
    conn.close()


def AddInDB(name = "Капибара", imgPath = PLACEHOLD_PATH):
    conn = sqlite3.connect('database.db')
    conn.execute("INSERT INTO views (name, img) VALUES (?, ?)",
             (name, imgPath))
    conn.commit()
    conn.close()


def ParseDB():
    conn = sqlite3.connect('database.db')
    cursor = conn.execute("SELECT id, name, img FROM views")
    kek = []
    for row in cursor:
        image_id, image_name, image_blob = row
        
        # print(image_id)
        
        if image_blob != PLACEHOLD_PATH:
            image_base64 = base64.b64encode(image_blob).decode('ascii')
            # im = Image.open(BytesIO(image_blob))
            # # print(im)
            # buffer = BytesIO()
            # im.save(buffer, format="JPEG")
            # im_b64 = base64.b64encode(buffer.getvalue()).decode()
            kek.append([image_id, image_name, image_base64])
            # # im.save(f"{image_name}.png", "PNG")
        else:
            kek.append([image_id, image_name, image_blob])
    conn.close()
    return kek


# with open("D:/Projects/Диплом/web/assets/cap.jpg", 'rb') as f:
#     picture = f.read()
#     print(picture)

CreateDataBase()
ParseDB()


# AddInDB()