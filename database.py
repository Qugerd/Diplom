import sqlite3
import uuid
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


def AddInDB(name , imgPath = PLACEHOLD_PATH):
    conn = sqlite3.connect('database.db')
    conn.execute("INSERT INTO views (name, img) VALUES (?, ?)",
             (name, Image_to_Bytes(imgPath)))
    conn.commit()
    print("Добавленно")
    conn.close()


def ParseDB():
    conn = sqlite3.connect('database.db')
    cursor = conn.execute("SELECT id, name, img FROM views ORDER BY name ASC")
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


def GetAboutViewData(title_name):
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


def InsertMetaDate(data: list):
    try:
        query = "INSERT INTO gallery (photo_path, kind, data, place, latitude, longitude, camera, group_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        data = tuple(data)

        conn = sqlite3.connect('database.db')
        conn.execute(query, data)
        conn.commit()
        conn.close()
        return "Фотографии добавлены в галлерею !"
    except sqlite3.Error as e:
        print("Ошибка:", e.args[0])


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
    cursor = conn.execute('SELECT id, photo_path, place, data, group_id, latitude, longitude FROM gallery WHERE kind=? ORDER BY data ASC', (kind,))
    data = []
    for row in cursor:
        data_list = list(row)
        data.append(data_list)
    conn.commit()
    conn.close()
    # print(data)
    return data


def GetPhoto(id):
    conn = sqlite3.connect('database.db')
    cursor = conn.execute('SELECT * FROM gallery WHERE id=?', (id,))
    data = list(cursor.fetchone())
    return data


def EditNotes(id, text):
    conn = sqlite3.connect('database.db')
    conn.execute("UPDATE gallery SET notes = ? WHERE id = ?", (text, id))
    conn.commit()
    conn.close()


def EditInformation(id, col_name, text):
    conn = sqlite3.connect('database.db')
    conn.execute(f"UPDATE views SET {col_name} = ? WHERE id = ?", (text, id))
    conn.commit()
    conn.close()


def GetCoordsAllPhotos(kind):
    conn = sqlite3.connect('database.db')
    cursor = conn.execute('SELECT latitude, longitude FROM gallery WHERE kind=?', (kind,))
    data = []
    for row in cursor:
        lat, log = convert_str_to_numeric(list(row))
        data.append([lat, log])
    conn.commit()
    conn.close()
    return data


def GetCoordsPhoto(id):
    conn = sqlite3.connect('database.db')
    cursor = conn.execute('SELECT latitude, longitude FROM gallery WHERE id=?', (id,))
    lat, log = convert_str_to_numeric(cursor.fetchone())
    conn.commit()
    conn.close()
    return [lat, log]


def GetAllFavoritePhotos(kind):
    conn = sqlite3.connect('database.db')
    cursor = conn.execute('SELECT id, photo_path FROM gallery WHERE like = 1 AND kind = ?', (kind, ))
    photos = []
    for row in cursor:
        photos.append(list(row))
    conn.commit()
    conn.close()
    return photos


def UpdateLikePhoto(like_value, id):
    conn = sqlite3.connect('database.db')
    conn.execute("UPDATE gallery SET like = ? WHERE id = ?", (like_value, id))
    conn.commit()
    conn.close()


def AddVideo(path_video, date, view):
    conn = sqlite3.connect('database.db')
    conn.execute("INSERT INTO video (path_video, date, view) VALUES (?, ?, ?)",
            (path_video, date, view))
    conn.commit()
    conn.close()


def GetVideoByView(view):
    conn = sqlite3.connect('database.db')
    cursor = conn.execute('SELECT * FROM video WHERE view=?', (view,))
    data = []
    for row in cursor:
        data.append(list(row))
    conn.commit()
    conn.close()
    return data


def AddSound(path_sound, view, date, country, place, type_, duration):
    try:
        conn = sqlite3.connect('database.db')
        conn.execute("INSERT INTO sounds (path_video, view, date, country, place, type, duration) VALUES (?, ?, ?, ?, ?, ?, ?)",
                (path_sound, view, date, country, place, type_, duration))
        conn.commit()
        conn.close()
        return "Добавлено"
    except sqlite3.Error as e:
        print("Ошибка:", e.args[0])


def GetSoundsByView(view):
    conn = sqlite3.connect('database.db')
    cursor = conn.execute('SELECT * FROM sounds WHERE view=?', (view,))
    data = []
    for row in cursor:
        data.append(list(row))
    conn.commit()
    conn.close()
    return data


def EditeNamesView(name, name_lat, name_eng, name_old):
    conn = sqlite3.connect('database.db')
    conn.execute("UPDATE views SET name = ?, name_lat = ?, name_eng = ? WHERE name = ?", (name, name_lat, name_eng, name_old))
    conn.commit()
    conn.close()


def DeleteVideo(id):
    conn = sqlite3.connect('database.db')
    conn.execute("DELETE FROM video WHERE id=?", (id, ))
    conn.commit()
    conn.close()
    
    
def DeleteSound(id):
    try:
        conn = sqlite3.connect('database.db')
        conn.execute("DELETE FROM sounds WHERE id=?", (id, ))
        conn.commit()
        conn.close()
    except sqlite3.Error as e:
        print("Ошибка:", e.args[0])


def EditeSound(id, date, country, place, type):
    try:
        conn = sqlite3.connect('database.db')
        conn.execute("UPDATE sounds SET date = ?, country = ?, place = ?, type = ? WHERE id = ?", (date, country, place, type, id))
        conn.commit()
        conn.close()
    except sqlite3.Error as e:
        print("Ошибка:", e.args[0])


def DeletePhoto(id):
    try:
        conn = sqlite3.connect('database.db')
        conn.execute("DELETE FROM gallery WHERE id=?", (id, ))
        conn.commit()
        conn.close()
    except sqlite3.Error as e:
            print("Ошибка:", e.args[0])
            
            
            
# GetSoundsByView("Капибара")
# GetVideoByView("Котик")
# GetAllFavoritePhotos()
# UpdateLikePhoto(0, 5)
# GetCoordsPhoto(2)
# GetCoordsAllPhotos("Капибара")
# GetPhoto(1)
# GetGalleryPhotos()
# InsertMetaDate()
# GetAllViews()
# GetAboutViewData()
# print(
# GetLastImage())
# CreateDataBase()
# ParseDB()
# AddInDB()