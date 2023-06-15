import base64
import os
import eel
import librosa
from datetime import datetime

PLACEHOLD_PATH = "http://placehold.it/150x150"
TITLE = ''
ID = ''


def Image_to_Bytes(image_path):
    print(image_path)
    if image_path != PLACEHOLD_PATH:
        with open(image_path, 'rb') as f:
            picture = f.read()
            return picture

    return image_path


def Blob_to_base64(image_blob):
    if image_blob != PLACEHOLD_PATH:
        image_base64 = base64.b64encode(image_blob).decode('ascii')
        return image_base64

    return image_blob


def convert_str_to_numeric(str):
    lat, log = str
    lat, log = float(lat.replace(',', '.')), float(log.replace(',', '.'))
    return lat, log


@eel.expose
def open_folder(path):
    path = path.replace('/', "\\")
    os.system('explorer /select,"'+path+'"')


def get_duration(path_file):
    y, sr = librosa.load(path_file)
    duration = librosa.get_duration(y=y, sr=sr)
    minutes = int(duration / 60)
    seconds = int(duration % 60)
    duration_formatted = "{:d}:{:02d}".format(minutes, seconds)

    print("Длительность файла составляет: {}".format(duration_formatted))
    return duration_formatted

def change_date_formate(date_str):
    # преобразовываем строку с датой в объект datetime
    date_obj = datetime.strptime(date_str, "%Y-%m-%d")
    # преобразовываем объект datetime обратно в строку в нужном формате
    new_date_str = date_obj.strftime("%d-%m-%Y")
    return new_date_str