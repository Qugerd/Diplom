import base64
import os
import eel
from datetime import datetime
import tempfile
import shutil
import exifread
from geopy.geocoders import Nominatim
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
    if lat != "" and log != "":
        lat, log = float(lat.replace(',', '.')), float(log.replace(',', '.'))
        return lat, log
    else:
        return lat, log

@eel.expose
def open_folder(path):
    path = path.replace('/', "\\")
    os.system('explorer /select,"'+path+'"')


def get_duration(path_file):
    # y, sr = librosa.load(path_file)
    # duration = librosa.get_duration(y=y, sr=sr)
    # minutes = int(duration / 60)
    # seconds = int(duration % 60)
    # duration_formatted = "{:d}:{:02d}".format(minutes, seconds)

    # print("Длительность файла составляет: {}".format(duration_formatted))
    return "none"

def change_date_formate(date_str):
    # преобразовываем строку с датой в объект datetime
    date_obj = datetime.strptime(date_str, "%Y-%m-%d")
    # преобразовываем объект datetime обратно в строку в нужном формате
    new_date_str = date_obj.strftime("%d-%m-%Y")
    return new_date_str


def absolute_path_to_relative_path(file_url):
    # Определяем путь к временной директории от корня проекта
    web_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'web')
    temp_dir_path = os.path.join(web_dir, 'temp')

    # Если директория для временных файлов не существует, создаем ее
    if not os.path.exists(temp_dir_path):
        os.makedirs(temp_dir_path)

    # Определяем путь для копии файла
    file_name = os.path.basename(file_url)
    dest_path = os.path.join(temp_dir_path, file_name)

    # Копируем файл
    shutil.copy(file_url, dest_path)

    # Получаем относительный путь до скопированного файла
    rel_path = os.path.relpath(dest_path, web_dir)

    # Выводим информацию о временной директории и скопированном файле
    print("Временная директория: ", temp_dir_path)
    print("Скопированный файл: ", dest_path)
    print("Относительный путь до файла: ", rel_path)


    return rel_path

@eel.expose
def delete_temp_dir():
    web_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'web')
    temp_dir_path = os.path.join(web_dir, 'temp')
    
    # # Удаляем все файлы из временной директории
    for file_name in os.listdir(temp_dir_path):
        file_path = os.path.join(temp_dir_path, file_name)
        try:
            if os.path.isfile(file_path):
                os.remove(file_path)
        except Exception as e:
            print(e)


def get_location(lat, lon):
    geolocator = Nominatim(user_agent="geo_locator")
    location = geolocator.reverse(f"{lat}, {lon}", language="ru")

    address = location.raw.get("address", {})

    city = (
        address.get("city") 
        or address.get("town") 
        or address.get("village") 
        or address.get("municipality")
    )

    return city


def get_photo_exif(photo_path):
    with open(photo_path, 'rb') as file:
        tags = exifread.process_file(file)

        data_and_time = tags['EXIF DateTimeOriginal'].values
        data = datetime.strptime(data_and_time, "%Y:%m:%d %H:%M:%S").strftime("%Y-%m-%d")

        make = tags["Image Make"].values
        model = tags["Image Model"].values

        if 'GPS GPSLatitude' in tags:
            lat = tags['GPS GPSLatitude'].values
            lon = tags['GPS GPSLongitude'].values

            lat_decimal = float(lat[0]) + float(lat[1])/60 + float(lat[2])/3600
            lon_decimal = float(lon[0]) + float(lon[1])/60 + float(lon[2])/3600




            # Учитываем направление (N/S, E/W)
            if tags['GPS GPSLatitudeRef'].values != 'N':
                lat_decimal = -lat_decimal
            if tags['GPS GPSLongitudeRef'].values != 'E':
                lon_decimal = -lon_decimal

                

            city = get_location(lat_decimal, lon_decimal)

            return [data, lat_decimal, lon_decimal, city, model]

        return [data, model]


# print(get_photo_exif(r'web\assets\geo.jpg'))
print(get_photo_exif(r'web\assets\no_geo.jpg'))
































