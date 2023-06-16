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
    return file_path


@eel.expose
def OpenFileDialogVideo():
    root = tk.Tk()
    root.withdraw()
    root.lift()
    root.attributes("-topmost", True)

    filetypes = (("MP4 files", "*.mp4"), ("All files", "*.*"))
    file_path = filedialog.askopenfilename(filetypes=filetypes)
    return file_path


@eel.expose
def OpenFileDialogSound():
    root = tk.Tk()
    root.withdraw()
    root.lift()
    root.attributes("-topmost", True)

    filetypes = (("MP3 files", "*.mp3"), ("All files", "*.*"))
    file_path = filedialog.askopenfilename(filetypes=filetypes)
    print(file_path)
    return file_path


@eel.expose
def OpenFilesDialog():
    root = tk.Tk()
    root.withdraw()
    root.lift()
    root.attributes("-topmost", True)

    file_path = filedialog.askopenfilenames(title='Выберите файлы')
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


@eel.expose
def save_id(id):
    global ID
    ID = id


@eel.expose
def set_value():
    return GetAboutViewData(TITLE)


@eel.expose
def fill_combobox_values():
    return GetAllViews()


@eel.expose
def put_data_to_db(data):
    InsertMetaDate(data)


@eel.expose
def delete_view_by_id(id):
    DeleteView(id)


@eel.expose
def edit_title(id, newName):
    EditTitle(id, newName)


@eel.expose
def get_gallery_photos():
    data_list = GetGalleryPhotos(TITLE)
    for data in data_list:
        data[1] = absolute_path_to_relative_path(data[1])
    print(data_list)
    return data_list


@eel.expose
def generate_group_id():
    return str(uuid.uuid4())


@eel.expose
def get_photo():
    data = GetPhoto(ID)
    data[1] = absolute_path_to_relative_path(data[1])
    print(data[1])
    return data


@eel.expose
def edit_notes(id, text):
    EditNotes(id, text)


@eel.expose
def edit_information(id, col_name, text):
    EditInformation(id, col_name, text)


@eel.expose
def get_coords_all_photos():
    return GetCoordsAllPhotos(TITLE)


@eel.expose
def get_coords_photo():
    return GetCoordsPhoto(ID)


@eel.expose
def get_all_favorite_photos():
    data_list = GetAllFavoritePhotos(TITLE)
    print(data_list)
    for data in data_list:
        data[1] = absolute_path_to_relative_path(data[1])
    print(data_list)
    return data_list


@eel.expose
def add_video(path_video, date):
    AddVideo(path_video, date, TITLE)


@eel.expose
def get_video_by_view():
    video_list = GetVideoByView(TITLE)
    for video in video_list:
        video[1] = absolute_path_to_relative_path(video[1])
    return video_list


@eel.expose
def add_sound(path_sound, date, country, place, type_):
    duration = get_duration(path_sound)
    return AddSound(path_sound, TITLE, date, country, place, type_, duration)


@eel.expose
def get_sounds_by_view():
    sound_list = GetSoundsByView(TITLE)
    for sound in sound_list:
        sound[1] = absolute_path_to_relative_path(sound[1])
    return sound_list


@eel.expose
def update_like_photo(like_value, id):
    UpdateLikePhoto(like_value, id)


@eel.expose
def edite_names_view(name, name_lat, name_eng):
    EditeNamesView(name, name_lat, name_eng, TITLE)


@eel.expose
def delete_video(id):
    DeleteVideo(id)
    

@eel.expose
def delete_sound(id):
    DeleteSound(id)


@eel.expose
def edite_sound(id, date, country, place, type):
    EditeSound(id, date, country, place, type)


@eel.expose
def delete_photo(id):
    DeletePhoto(id)


eel.init("web")

eel.start("main.html", size=(1920, 1080), position=(200,200), shutdown_delay=10.0, mode='chrome', host="localhost", port="8000")