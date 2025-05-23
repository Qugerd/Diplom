import sqlite3
import uuid
from PIL import Image
from io import BytesIO
from support import *




import sqlite3

import sqlite3

def CreateDataBase():
    conn = sqlite3.connect('database.db')
    
    # Создание таблицы views
    conn.execute('''CREATE TABLE IF NOT EXISTS views
                (id INTEGER PRIMARY KEY,
                 name TEXT NOT NULL UNIQUE,
                 img BLOB,
                 name_lat TEXT,
                 name_eng TEXT,
                 description TEXT,
                 spreading TEXT,
                 biology TEXT,
                 family_id INTEGER,
                 FOREIGN KEY (family_id) REFERENCES family (id) ON DELETE CASCADE);''')
    
    # Создание таблицы gallery
    conn.execute('''CREATE TABLE IF NOT EXISTS gallery
                (id INTEGER PRIMARY KEY,
                 photo_path TEXT,
                 kind TEXT,
                 data TEXT,
                 place TEXT,
                 latitude TEXT,
                 longitude TEXT,
                 camera TEXT,
                 group_id TEXT NOT NULL,
                 notes TEXT,
                 like INTEGER,
                 FOREIGN KEY (kind) REFERENCES views (name) ON DELETE CASCADE);''')
    
    # Создание таблицы sounds
    conn.execute('''CREATE TABLE IF NOT EXISTS sounds
                (id INTEGER PRIMARY KEY,
                 path_video TEXT,
                 view TEXT,
                 date TEXT,
                 country TEXT,
                 place TEXT,
                 type TEXT,
                 duration TEXT,
                 FOREIGN KEY (view) REFERENCES views (name) ON DELETE CASCADE);''')
    
    # Создание таблицы video
    conn.execute('''CREATE TABLE IF NOT EXISTS video
                (id INTEGER PRIMARY KEY,
                 path_video TEXT,
                 view TEXT,
                 date TEXT,
                 place TEXT,
                 FOREIGN KEY (view) REFERENCES views (name) ON DELETE CASCADE);''')
    
    # Создание таблицы squad
    conn.execute('''CREATE TABLE IF NOT EXISTS squad
                (id INTEGER PRIMARY KEY,
                 squad_name TEXT);''')
    
    # Создание таблицы family
    conn.execute('''CREATE TABLE IF NOT EXISTS family
                (id INTEGER PRIMARY KEY,
                 family_name TEXT,
                 squad_id INTEGER,
                 FOREIGN KEY (squad_id) REFERENCES squad (id) ON DELETE CASCADE);''')
    
    conn.execute('''CREATE TABLE IF NOT EXISTS photo_variations
                (id INTEGER PRIMARY KEY,
                 original_id INTEGER NOT NULL,
                photo_path TEXT NOT NULL,
                FOREIGN KEY (original_id) REFERENCES gallery (id) ON DELETE CASCADE)''')

    conn.commit()
    conn.close()


def AddPhotoVersion(original_id, photo_path):
    conn = sqlite3.connect('database.db')
    conn.execute("INSERT INTO photo_variations (original_id, photo_path) VALUES (?, ?)",
                 (original_id, photo_path))
    conn.commit()
    conn.close()

def GetPhotosVersion(original_id):
    conn = sqlite3.connect('database.db')
    cursor = conn.execute('''SELECT * FROM photo_variations WHERE original_id = ? 
                 ''', 
                 (original_id,))

    data = cursor.fetchall()
    return data

# print(GetPhotosVersion(1))
# path = "C:/Users/asus/Downloads/птицы/Мандаринка/b02fcbf9349b3cca44a029b856040a6e.jpg"
# AddPhotoVersion(1, path)

def DeletePhotoVersion(id):
    conn = sqlite3.connect('database.db')
    conn.execute("DELETE FROM photo_variations WHERE id = ?", (id, ))
    conn.commit()
    conn.close()


def AddInDB(name, img, name_lat, name_eng, description, spreading, biology, family_id):
    conn = sqlite3.connect('database.db')
    conn.execute("INSERT INTO views (name, img, name_lat, name_eng, description, spreading, biology, family_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
             (name, Image_to_Bytes(img), name_lat, name_eng, description, spreading, biology, family_id))
    conn.commit()
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
    cursor = conn.execute("SELECT name FROM views ORDER BY name ASC")
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
        return "Ошибка обавления"


def DeleteView(id, title):
    conn = sqlite3.connect('database.db')
    conn.execute("DELETE FROM views WHERE id=?", (id, ))
    conn.execute("DELETE FROM gallery WHERE kind=?", (title,))
    conn.execute("DELETE FROM video WHERE view=?", (title,))
    conn.execute("DELETE FROM sounds WHERE view=?", (title,))
    conn.commit()
    conn.close()


def EditTitle(id, newName, old_title):
    conn = sqlite3.connect('database.db')
    conn.execute("UPDATE views SET name = ? WHERE id = ?", (newName, id))
    conn.execute("UPDATE gallery SET kind = ? WHERE kind = ?", (newName, old_title))
    conn.execute("UPDATE video SET view = ? WHERE view = ?", (newName, old_title))
    conn.execute("UPDATE sounds SET view = ? WHERE view = ?", (newName, old_title))
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


def AddPhotoGalleryCollection(photo_path, kind, data, place, latitude, longitude, group_id):
    conn = sqlite3.connect('database.db')
    conn.execute("INSERT INTO gallery (photo_path, kind, data, place, latitude, longitude, group_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (photo_path, kind, data, place, latitude, longitude, group_id))
    conn.commit()
    conn.close()



def GetGroupPhotos(id, group_id):
    conn = sqlite3.connect('database.db')
    cursor = conn.execute("SELECT * FROM gallery WHERE id != ? AND group_id = ?", (id, group_id))
    data = list(cursor.fetchall())
    return data


def GetPhoto(id):
    conn = sqlite3.connect('database.db')
    cursor = conn.execute('SELECT * FROM gallery WHERE id=?', (id,))
    data = list(cursor.fetchone())
    return data


def EditPhotoPath(id, new_path):
    conn = sqlite3.connect('database.db')
    conn.execute("UPDATE gallery SET photo_path = ? WHERE id = ?", (new_path, id))
    conn.commit()
    conn.close()

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


# def GetCoordsAllPhotos(kind):
#     conn = sqlite3.connect('database.db')
#     cursor = conn.execute('SELECT latitude, longitude FROM gallery WHERE kind=?', (kind,))
#     data = []
#     for row in cursor:
#         lat, log = convert_str_to_numeric(list(row))
#         data.append([lat, log])
#     conn.commit()
#     conn.close()
#     return dat
# 


def GetGalleryAllInfo(kind):
    conn = sqlite3.connect('database.db')
    cursor = conn.execute('SELECT * FROM gallery WHERE kind=?', (kind,))
    data = list(cursor.fetchall())
    conn.commit()
    conn.close()
    return data

# print(GetCoordsAllPhotos("Тонкоклювый буревестник"))

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


def AddVideo(path_video, date, view, place):
    conn = sqlite3.connect('database.db')
    conn.execute("INSERT INTO video (path_video, date, view, place) VALUES (?, ?, ?, ?)",
            (path_video, date, view, place))
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
        # print("Ошибка:", e.args[0])
        pass


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
        # print("Ошибка:", e.args[0])
        pass


def EditeSound(id, date, country, place, type):
    try:
        conn = sqlite3.connect('database.db')
        conn.execute("UPDATE sounds SET date = ?, country = ?, place = ?, type = ? WHERE id = ?", (date, country, place, type, id))
        conn.commit()
        conn.close()
    except sqlite3.Error as e:
        # print("Ошибка:", e.args[0])
        pass


def DeletePhoto(id):
    try:
        conn = sqlite3.connect('database.db')
        conn.execute("DELETE FROM gallery WHERE id=?", (id, ))
        conn.commit()
        conn.close()
    except sqlite3.Error as e:
            # print("Ошибка:", e.args[0])
            pass


def AddSquad(squad_name):
    conn = sqlite3.connect('database.db')
    conn.execute("INSERT INTO squad (squad_name) VALUES (?)",
            (squad_name,))
    conn.commit()
    conn.close()


def GetAllSquad():
    conn = sqlite3.connect('database.db')
    cursor = conn.execute('SELECT * FROM squad ORDER BY squad_name ASC')
    data = []
    for row in cursor:
        id, squad_name = row
        data.append([id, squad_name])
    conn.commit()
    conn.close()
    return data



def AddFamily(family_name, squad_id):
    conn = sqlite3.connect('database.db')
    conn.execute("INSERT INTO family (family_name, squad_id) VALUES (?, ?)",
            (family_name, squad_id))
    conn.commit()
    conn.close()


def GetAllFamilyById(squad_id):
    conn = sqlite3.connect('database.db')
    cursor = conn.execute('SELECT * FROM family WHERE squad_id=? ORDER BY family_name ASC', (squad_id,))
    data = []
    for row in cursor:
        id, family_name, squad_id = row
        data.append([id, family_name, squad_id])
    conn.commit()
    conn.close()
    return data


def GetAllView():
    conn = sqlite3.connect('database.db')
    cursor = conn.execute('SELECT name FROM views ORDER BY name ASC')
    data = []
    for row in cursor:
        data.append(row[0])
    conn.commit()
    conn.close()
    return data


def GetAllFamily():
    conn = sqlite3.connect('database.db')
    cursor = conn.execute('SELECT id, family_name FROM family ORDER BY family_name ASC')
    data = []
    for row in cursor:
        id, family_name = row
        data.append([id, family_name])
    conn.commit()
    conn.close()
    print(data)
    return data


def GetViewInFamily(family_id):
    conn = sqlite3.connect('database.db')
    cursor = conn.execute('SELECT name, family_id FROM views WHERE family_id=? ORDER BY name ASC', (family_id, ))
    data = []
    for row in cursor:
        name, family_name = row
        data.append([name, family_name])
    conn.commit()
    conn.close()
    print(data)
    return data


def AddViewToFamily(name, family_id):
    conn = sqlite3.connect('database.db')
    conn.execute("UPDATE views SET family_id = ? WHERE name = ?", (family_id, name))
    conn.commit()
    conn.close()


def ChangePreview(id, img):
    conn = sqlite3.connect('database.db')
    conn.execute("UPDATE views SET img = ? WHERE id = ?", (Image_to_Bytes(img), id))
    conn.commit()
    conn.close()




















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