import base64
import os
import eel
from datetime import datetime
import tempfile
import shutil
import exifread
from geopy.geocoders import Nominatim
from datetime import datetime
from hachoir.parser import createParser
from hachoir.metadata import extractMetadata
from mutagen.mp3 import MP3
from mutagen.easyid3 import EasyID3
from mutagen.mp4 import MP4
import os
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




def change_date_formate(date_str):
    # преобразовываем строку с датой в объект datetime
    date_obj = datetime.strptime(date_str, "%Y-%m-%d")
    # преобразовываем объект datetime обратно в строку в нужном формате
    new_date_str = date_obj.strftime("%d-%m-%Y")
    return new_date_str


def absolute_path_to_relative_path(file_url):

    if isinstance(file_url, str) and (file_url.startswith('http://') or file_url.startswith('https://')):
        return file_url

    if not os.path.exists(file_url):
        return ""

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
    # print("Временная директория: ", temp_dir_path)
    # print("Скопированный файл: ", dest_path)
    # print("Относительный путь до файла: ", rel_path)


    return rel_path

@eel.expose
def delete_temp_dir():
    web_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'web')
    temp_dir_path = os.path.join(web_dir, 'temp')
    
    # Проверяем, существует ли временная директория
    if os.path.exists(temp_dir_path):
        # Удаляем все файлы из временной директории
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

        data = ""
        model = ""
        result = ["", ""]

        if 'EXIF DateTimeOriginal' in tags and "Image Make" in tags:
            data_and_time = tags['EXIF DateTimeOriginal'].values
            data = datetime.strptime(data_and_time, "%Y:%m:%d %H:%M:%S").strftime("%Y-%m-%d")

            make = tags["Image Make"].values
            model = tags["Image Model"].values

            result = [data, model]


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

            result = [data, lat_decimal, lon_decimal, city, model]

        return result


@eel.expose
def get_video_date(file_path):
    parser = createParser(file_path)
    if not parser:
        print("Не удалось создать парсер")
        return

    with parser:
        metadata = extractMetadata(parser)
        if metadata:
            for item in metadata.exportPlaintext():
                if "Creation date" in item or "Creation time" in item or "Date" in item:
                    # Пример: 'Creation date: 2023-05-27 15:30:45'
                    # Отделяем после двоеточия и берем только дату
                    date_time_str = item.split(":", 1)[1].strip()
                    date_only = date_time_str.split(" ")[0]
                    return date_only




@eel.expose
def get_audio_creation_date(file_path):
    """
    Попытка извлечения даты из аудиофайла (.mp3 или .m4a)
    
    1. Сначала ищет в тегах аудиофайла.
    2. Если не найдено — можно использовать дату создания файла в ОС.
    3. Возвращает строку с датой или None.
    4. use_filesystem_date — флаг, включает использование даты файла в ОС как fallback.
    """

    use_filesystem_date = True
    _, ext = os.path.splitext(file_path.lower())

    try:
        date_from_tags = None
        if ext == ".mp3":
            audio = EasyID3(file_path)
            date = audio.get("date", audio.get("year"))
            date_from_tags = date[0] if date else ""

        elif ext == ".m4a":
            audio = MP4(file_path)
            date = audio.get("\xa9day")  # \xa9day — стандартный ключ для даты в M4A
            date_from_tags = date[0] if date else ""

        else:
            print(f"Неподдерживаемый формат: {ext}")
            return ""

        # 1–3. Проверяем, нашли ли дату в тегах
        if date_from_tags:
            return date_from_tags

        # 4. Если дата не найдена в тегах, используем дату создания файла
        if use_filesystem_date:
            creation_time = os.path.getctime(file_path)
            creation_date = datetime.fromtimestamp(creation_time).strftime('%Y-%m-%d')
            return creation_date

    except Exception as e:
        print(f"Ошибка при чтении файла {file_path}: {e}")
        return ""

    return ""
# date_mp3 = get_audio_creation_date(r"C:\Users\asus\Downloads\Recording_1.m4a")
# date_m4a = get_audio_creation_date(r"C:\Users\asus\Downloads\брэт.mp3")


















# print(get_video_metadata(r'C:\Users\asus\Downloads\1.mp4'))
# print(get_photo_exif(r'C:\Users\asus\Downloads\2.mp4'))
# print(get_photo_exif(r'web\assets\no_geo.jpg'))
































