import sqlite3
from PIL import Image
from io import BytesIO
from support import *





def CreateDataBase():
    conn = sqlite3.connect('database.db')
    conn.execute('''CREATE TABLE IF NOT EXISTS views
                (id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                img BLOB,
                name_lat TEXT,
                name_eng TEXT,
                description TEXT,
                spreading TEXT,
                biology TEXT);''')
    conn.commit()
    conn.close()


def AddInDB(name = "Капибара", imgPath = PLACEHOLD_PATH):
    conn = sqlite3.connect('database.db')
    conn.execute("INSERT INTO views (name, img) VALUES (?, ?)",
             (name, Image_to_Bytes(imgPath)))
    conn.commit()
    print("Добавленно")
    conn.close()


def ParseDB():
    conn = sqlite3.connect('database.db')
    cursor = conn.execute("SELECT id, name, img FROM views")
    kek = []
    for row in cursor:
        image_id, image_name, image_blob = row
        kek.append([image_id, image_name, Blob_to_base64(image_blob)])
    conn.close()
    return kek


def GetLastImage():
    conn = sqlite3.connect('database.db')
    cursor = conn.execute("SELECT img FROM views WHERE ID=(SELECT MAX(ID) FROM views)")
    for row in cursor:
        img_blob_tuple = row
        img_blob = img_blob_tuple[0]
        # print(img_blob)
    conn.close()
    return Blob_to_base64(img_blob)


def GetAboutViewData(title_name="Капибара"):
    query = "SELECT * FROM views WHERE name = ?"

    conn = sqlite3.connect('database.db')
    cursor = conn.execute(query, (title_name, ))
    response = list(cursor.fetchone())
    conn.close()
    response[2] = Blob_to_base64(response[2])

    return response


def GetAllViews():
    conn = sqlite3.connect('database.db')
    cursor = conn.execute("SELECT name FROM views")
    list_name = []
    for row in cursor:
        value = list(row)[0]
        list_name.append(value)
    conn.close()
    return list_name


def InsertMetaDate(data):
    query = "INSERT INTO gallery (photo_path, kind, data, place, latitude, longitude, camera) VALUES (?, ?, ?, ?, ?, ?, ?)"
    data = tuple(data)

    conn = sqlite3.connect('database.db')
    conn.execute(query, data)
    conn.commit()
    conn.close()


def DeleteView(id):
    conn = sqlite3.connect('database.db')
    conn.execute("DELETE FROM views WHERE id=?", (id, ))
    conn.commit()
    conn.close()


def EditTitle(id, newName):
    conn = sqlite3.connect('database.db')
    conn.execute("UPDATE views SET name = ? WHERE id = ?", (newName, id))
    conn.commit()
    conn.close()


def GetGalleryPhotos(kind):
    conn = sqlite3.connect('database.db')
    cursor = conn.execute('SELECT id, photo_path, place, data FROM gallery WHERE kind=? ORDER BY data ASC', (kind,))
    data = []
    for row in cursor:
        data_tuple = list(row)
        data.append(data_tuple)
    conn.commit()
    conn.close()
    print(data)
    return data




# GetGalleryPhotos()
# InsertMetaDate()
# GetAllViews()
# GetAboutViewData()
# print(
# GetLastImage())
# CreateDataBase()
# ParseDB()
# AddInDB()