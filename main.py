import eel
import tkinter as tk
from tkinter import filedialog
from database import *
import sys
import io



# outfile = open("logfile.txt", "wt")
# sys.stderr = outfile
# sys.stdout = outfile

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
    # print(file_path)
    return file_path


@eel.expose
def OpenFilesDialog():
    root = tk.Tk()
    root.withdraw()
    root.lift()
    root.attributes("-topmost", True)

    file_path = filedialog.askopenfilenames(title='Выберите файлы')
    print(file_path)

    exif = get_photo_exif(file_path[0])

    return file_path, exif


@eel.expose
def parse():
    return ParseDB()


@eel.expose
def add_to_db(name, img, name_lat, name_eng, description, spreading, biology):
    AddInDB(name, img, name_lat, name_eng, description, spreading, biology)


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
    print(TITLE)
    return GetAboutViewData(TITLE)


@eel.expose
def fill_combobox_values():
    return GetAllViews()


@eel.expose
def put_data_to_db(data):
    print(data)
    return InsertMetaDate(data)


@eel.expose
def delete_view_by_id(id, title):
    DeleteView(id, title)


@eel.expose
def edit_title(id, newName, old_title):
    EditTitle(id, newName, old_title)


@eel.expose
def get_gallery_photos():
    data_list = GetGalleryPhotos(TITLE)
    for data in data_list:
        data[1] = absolute_path_to_relative_path(data[1])
    # print(data_list)
    return data_list


@eel.expose
def generate_group_id():
    return str(uuid.uuid4())

# FIXME: обработать то что у файла может измениться путь
@eel.expose
def get_photo():
    data = GetPhoto(ID)
    absolute_path = data[1]
    data[1] = absolute_path_to_relative_path(data[1])
    data.append(absolute_path)
    # print('get photo', data[1])
    return data


@eel.expose
def edit_photo_path(id, new_path):
    EditPhotoPath(id, new_path)

@eel.expose
def edit_notes(id, text):
    EditNotes(id, text)


@eel.expose
def edit_information(id, col_name, text):
    EditInformation(id, col_name, text)


@eel.expose
def get_gallery_all_info():
    return GetGalleryAllInfo(TITLE)


@eel.expose
def get_coords_photo():
    return GetCoordsPhoto(ID)


@eel.expose
def get_all_favorite_photos():
    data_list = GetAllFavoritePhotos(TITLE)
    # print(data_list)
    for data in data_list:
        data[1] = absolute_path_to_relative_path(data[1])
    # print(data_list)
    return data_list


@eel.expose
def add_video(path_video, date):
    AddVideo(path_video, date, TITLE)


@eel.expose
def get_video_by_view():
    video_list = GetVideoByView(TITLE)

    for video in video_list:
        absolute_path = video[1]
        video[1] = absolute_path_to_relative_path(video[1])
        video.append(absolute_path)
    return video_list


@eel.expose
def add_sound(path_sound, date, country, place, type_):
    duration = get_duration(path_sound)
    return AddSound(path_sound, TITLE, date, country, place, type_, duration)


@eel.expose
def get_sounds_by_view():
    sound_list = GetSoundsByView(TITLE)

    for sound in sound_list:
        absolute_path = sound[1]
        sound[1] = absolute_path_to_relative_path(sound[1])
        sound.append(absolute_path)
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


@eel.expose
def add_squad(text):
    AddSquad(text)


@eel.expose
def get_all_squad():
    return GetAllSquad()


@eel.expose
def add_family(text, squad_id):
    AddFamily(text, squad_id)


@eel.expose
def get_all_family_by_id(squad_id):
    return GetAllFamilyById(squad_id)


@eel.expose
def get_all_view():
    return GetAllView()


@eel.expose
def get_all_family():
    return GetAllFamily()


@eel.expose
def get_view_in_family(family_id):
    return GetViewInFamily(family_id)


@eel.expose
def add_view_to_family(vidName, familyId):
    AddViewToFamily(vidName, familyId)


@eel.expose
def change_preview(id, img):
    print(img)
    ChangePreview(id, img)




CreateDataBase()

delete_temp_dir()





eel.init("web")

eel.start("main.html", shutdown_delay=10.0, mode='chrome', host="localhost", port="8000", cmdline_args=['--start-maximized'])