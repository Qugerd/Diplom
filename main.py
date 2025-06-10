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

    filetypes = (("Audio files", "*.mp3 *.m4a"), ("All files", "*.*"))
    file_path = filedialog.askopenfilename(filetypes=filetypes)
    # print(file_path)
    return file_path


@eel.expose
def OpenFilesDialog():
    root = tk.Tk()
    root.withdraw()
    root.lift()
    root.attributes("-topmost", True)

    files_paths = filedialog.askopenfilenames(title='Выберите файлы')
    print(files_paths)

    exif = False

    if files_paths:
        for file_path in files_paths:
            current_exif = get_exif_data(file_path)
            if current_exif and current_exif != ['', '', '', '', '', '']:
                exif = current_exif
                break

    return files_paths, exif


@eel.expose
def parse():
    return ParseDB()


@eel.expose
def add_to_db(name, img, name_lat, name_eng, description, spreading, biology, family_id):
    return AddInDB(name, img, name_lat, name_eng, description, spreading, biology, family_id)


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


@eel.expose
def get_photo():
    data = GetPhoto(ID)
    absolute_path = data[1]
    data[1] = absolute_path_to_relative_path(data[1])
    data.append(absolute_path)
    # print('get photo', data[1])
    return data

@eel.expose
def get_group_photos(id, group_id):
    data = GetGroupPhotos(id, group_id)
    for i in range(len(data)):
        data[i] = list(data[i])
        data[i][1] = absolute_path_to_relative_path(data[i][1])
    return data

@eel.expose
def add_photo_version(id, photo_path):
    AddPhotoVersion(id, photo_path)

@eel.expose
def get_photos_version(id):
    data = GetPhotosVersion(id)
    for i in range(len(data)):
        data[i] = list(data[i])
        data[i].append(data[i][2])
        data[i][2] = absolute_path_to_relative_path(data[i][2])
    return data

@eel.expose
def delete_photo_version(id):
    DeletePhotoVersion(id)

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
def add_photo_gallery_collection(photo_path, data, place, latitude, longitude, group_id):
    kind = TITLE
    print(photo_path, kind, data, place, latitude, longitude, group_id)
    AddPhotoGalleryCollection(photo_path, kind, data, place, latitude, longitude, group_id)

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
def add_video(path_video, date, place):
    AddVideo(path_video, date, TITLE, place)


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
    duration = ""
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
    return AddSquad(text)


@eel.expose
def get_all_squad():
    return GetAllSquad()


@eel.expose
def add_family(family_name):
    return AddFamily(family_name)


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

@eel.expose
def get_photo_kind_by_date(start_date, end_date):
    # print(GetPhotoKindByDate(start_date, end_date))
    return GetPhotoKindByDate(start_date, end_date)


@eel.expose
def get_kinds_by_kinds_and_date(kinds, start_date, end_date):
    data = GetKindsByKindsAndDate(kinds, start_date, end_date)
    for i in range(len(data)):
        data[i] = list(data[i])
        data[i][1] = absolute_path_to_relative_path(data[i][1])
    return data


@eel.expose
def delete_squad_by_id(squad_id):
    DeleteSquadById(squad_id)


@eel.expose
def delete_family_by_id(family_id):
    DeleteFamilyById(family_id)


@eel.expose
def add_family_to_squad(squad_id, family_id):
    AddFamilyToSquad(squad_id, family_id)


@eel.expose
def add_excel_data_to_db(path):
    squads, families, views = parse_exif_data(path)
    
    for squad in squads:
        AddSquad(squad)

    for family, squad in families:
        AddFamilyAndSquad(family, squad)

    for view in views:
        AddViewsList(view['name'], view['family'])


@eel.expose
def open_file_dialog_excel():
    root = tk.Tk()
    root.withdraw()
    root.lift()
    root.attributes("-topmost", True)

    filetypes = (("Excel files", "*.xlsx"), ("All files", "*.*"))
    file_path = filedialog.askopenfilename(filetypes=filetypes)
    return file_path


@eel.expose
def get_views_list():
    return GetViewsList()


@eel.expose
def select_database():
    root = tk.Tk()
    root.withdraw()
    root.lift()
    root.attributes("-topmost", True)

    filetypes = (("SQLite", "*.db"), ("All files", "*.*"))
    file_path = filedialog.askopenfilename(filetypes=filetypes)
    return file_path





@eel.expose
def create_new_database():
    db_path = "database.db"
    index = 1
    while os.path.exists(db_path):
        db_path = f"database_{index}.db"
        index += 1
    CreateDataBase(db_path)

    if os.path.exists(db_path):
        return f"База данных успешно создана: {db_path}"
    else:
        return "Ошибка: не удалось создать базу данных"










CreateDataBase()

delete_temp_dir()




try:
    eel.init("web")

    eel.start("main.html", shutdown_delay=10.0, mode='chrome', host="localhost", port="8000", cmdline_args=['--start-maximized'])
except (KeyboardInterrupt, SystemExit):
    print("Закрыто пользователем")
except Exception as e:
    print(f"Ошибка WebSocket: {e}")