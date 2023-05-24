import eel
import tkinter as tk
from tkinter import filedialog
from database import *


@eel.expose
def OpenFileDialog():
    root = tk.Tk()
    root.withdraw()
    root.lift()
    root.attributes("-topmost", True)

    file_path = filedialog.askopenfilename()
    print(file_path)
    return file_path


@eel.expose
def OpenFilesDialog():
    root = tk.Tk()
    root.withdraw()
    root.lift()
    root.attributes("-topmost", True)

    file_path = filedialog.askopenfilenames(title='Выберите файлы')
    print(file_path)
    return file_path


@eel.expose
def parse():
    return ParseDB()


@eel.expose
def add_to_db(name, imgPath):
    AddInDB(name, imgPath)


@eel.expose
def get_last_image():
    return GetLastImage()



@eel.expose
def save_value(title):
    global TITLE 
    TITLE = title
    print(TITLE)


@eel.expose
def save_id(id):
    global ID
    ID = id
    print(ID)


@eel.expose
def set_value():
    return GetAboutViewData(TITLE)


@eel.expose
def fill_combobox_values():
    return GetAllViews()



@eel.expose
def put_data_to_db(data):
    print(data)
    InsertMetaDate(data)


@eel.expose
def delete_view_by_id(id):
    DeleteView(id)


@eel.expose
def edit_title(id, newName):
    print(id, newName)
    EditTitle(id, newName)


@eel.expose
def get_gallery_photos():
    print(TITLE)
    print(GetGalleryPhotos(TITLE))
    return GetGalleryPhotos(TITLE)


@eel.expose
def generate_group_id():
    return str(uuid.uuid4())


@eel.expose
def get_photo():
    print(ID)
    return GetPhoto(ID)



@eel.expose
def edit_notes(id, text):
    EditNotes(id, text)


eel.init("web")

eel.start("main.html", size=(1920, 1080), position=(200,200), shutdown_delay=10.0)