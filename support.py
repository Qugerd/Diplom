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
import pandas as pd
import re
import exiftool
import rawpy
from PIL import Image
from concurrent.futures import ThreadPoolExecutor
import hashlib
import time
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import models, transforms
from PIL import Image
import os



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


import os
import shutil
import hashlib
import time
import rawpy
from PIL import Image
from concurrent.futures import ThreadPoolExecutor


# Кэш
_CONVERSION_CACHE = {}

# Поддерживаемые браузером форматы
BROWSER_SUPPORTED_FORMATS = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif'}

def _get_file_hash(file_path, chunk_size=1024 * 1024):
    hasher = hashlib.md5()
    with open(file_path, 'rb') as f:
        chunk = f.read(chunk_size)
        hasher.update(chunk)
    return hasher.hexdigest()

def _convert_to_jpg(input_path, output_path):
    try:
        start_time = time.time()
        ext = os.path.splitext(input_path)[1].lower()

        if ext == '.cr3':
            with rawpy.imread(input_path) as raw:
                rgb = raw.postprocess(
                    use_camera_wb=True,
                    half_size=True,
                    no_auto_bright=False,
                    output_bps=8
                )
            img = Image.fromarray(rgb)
        else:
            img = Image.open(input_path).convert("RGB")

        img.save(output_path, format='JPEG', quality=50)
        print(f"Конвертация {os.path.basename(input_path)} завершена за {time.time() - start_time:.2f} сек")
        return True
    except (rawpy.LibRawError, Exception) as e:
        print(f"Ошибка при конвертации {input_path}: {str(e)}")
        return False

def absolute_path_to_relative_path(file_url):
    if isinstance(file_url, str) and (file_url.startswith('http://') or file_url.startswith('https://')):
        return file_url

    if not os.path.exists(file_url):
        return ""

    web_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'web')
    temp_dir_path = os.path.join(web_dir, 'temp')
    os.makedirs(temp_dir_path, exist_ok=True)

    ext = os.path.splitext(file_url)[1].lower()

    # Браузер поддерживает? Просто копируем.
    if ext in BROWSER_SUPPORTED_FORMATS:
        file_name = os.path.basename(file_url)
        dest_path = os.path.join(temp_dir_path, file_name)
        if not os.path.exists(dest_path) or os.path.getmtime(file_url) > os.path.getmtime(dest_path):
            shutil.copy2(file_url, dest_path)
        return os.path.relpath(dest_path, web_dir)

    # Конвертация
    file_hash = _get_file_hash(file_url)
    base_name = os.path.splitext(os.path.basename(file_url))[0]
    jpg_name = f"{base_name}.jpg"
    jpg_temp_path = os.path.join(temp_dir_path, jpg_name)

    if file_hash in _CONVERSION_CACHE and os.path.exists(jpg_temp_path):
        return os.path.relpath(jpg_temp_path, web_dir)

    if _convert_to_jpg(file_url, jpg_temp_path):
        _CONVERSION_CACHE[file_hash] = True
        return os.path.relpath(jpg_temp_path, web_dir)

    return ""



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


import subprocess
import json

import subprocess

import subprocess
from datetime import datetime

import exiftool

def get_exif_data(file_path):
    tags = ["EXIF:CreateDate",
            "EXIF:GPSLatitude", 
            "EXIF:GPSLongitude", 
            "EXIF:Model",
            "EXIF:LensModel"]
    
    info = []
    with exiftool.ExifToolHelper() as et:
        metadata = et.get_metadata(file_path)[0]

        if tags[0] in metadata:
            datetime_obj = datetime.strptime(metadata[tags[0]], "%Y:%m:%d %H:%M:%S")
            date_YYYY_MM_DD = datetime_obj.strftime("%Y-%m-%d")
            info.append(date_YYYY_MM_DD)
        else:
            info.append("")

        if tags[1] in metadata and tags[2] in metadata:
            lat = metadata[tags[1]]
            lon = metadata[tags[2]]
            place = get_location(lat, lon)
            info.extend([lat, lon, place])
        else:
            info.extend(["", "", ""])

        if tags[3] in metadata:
            info.append(metadata[tags[3]])
        else:
            info.append("")

        if tags[4] in metadata:
            info.append(metadata[tags[4]])
        else:
            info.append("")

    print(info)
    return info





# Пример использования
# file = "D:\\Projects\\Diplom\\web\\assets\\no_geo.jpg"
# file = "D:\\Projects\\Diplom\\web\\assets\\IMG20250607201542.jpg"
# file = "D:\\Projects\\Diplom\\web\\assets\\6be364941202dc4d71ea1acb6a117aa3.jpg"





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



def capitalize_first_letter(word):
    return word[0].upper() + word[1:].lower() if word else word






def parse_exif_data(file_path):
    # file_path = "C:\\Users\\asus\\Desktop\\список видов рус_лат.xlsx"
    xls = pd.ExcelFile(file_path)

    df = xls.parse('Лист1')

    # Исходные данные
    data = df[1]  # колонка, содержащая отряды, семейства и виды
    name_rus = df[10]
    name_lat = df[11]

    # Контейнеры
    squads = []
    families = []
    views = []

    # Текущие значения
    current_squad = None
    current_family = None

    # Функция для проверки: строка с видом — начинается с цифры и содержит латинское название в скобках
    def is_view(row_text):
        return isinstance(row_text, str) and bool(re.match(r'^\d+.*\([A-Za-z ]+\)', row_text))

    # Основной парсинг
    for idx, value in data.items():
        if pd.isna(value):
            continue

        text = str(value).strip()

        if not is_view(text):
            # Это либо отряд, либо семейство
            if text.endswith("образные"):
                current_squad = text
                if current_squad not in squads:
                    squads.append(current_squad)
            else:
                current_family = text
                if current_family not in families:
                    families.append((current_family, current_squad))
        else:
            # Это вид
            views.append({
                "name": name_rus.get(idx, "").strip(),
                "name_lat": name_lat.get(idx, "").strip(),
                "squad": current_squad,
                "family": current_family
            })


    return squads, families, views


# for view in views:
#     name, family = view["name"], view["family"]
#     AddViewsList(name, family)


def get_confing_database_path():
    with open("web/config.json", "r") as config_file:
        config = json.load(config_file)

    db_path = config["database"]["path"]
    return db_path





device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

def load_model(model_path, num_classes, device=device):
    model = models.efficientnet_b3(pretrained=False)
    model.classifier[1] = nn.Linear(model.classifier[1].in_features, num_classes)
    model = model.to(device)

    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()
    
    return model

def create_predict_transform():
    return transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

def predict_image(model, image_path, transform, class_names, device=device):
    try:
        image = Image.open(image_path).convert('RGB')
        image = transform(image).unsqueeze(0).to(device)
        
        with torch.no_grad():
            outputs = model(image)
            probs = F.softmax(outputs, dim=1)
            max_prob, preds = torch.max(probs, 1)

        return class_names[preds.item()], "{:.2f}%".format(max_prob.item()*100)

    except Exception as e:
        print(f"Ошибка при обработке изображения: {e}")
        return None





















# print(get_video_Dmetadata(r'C:\Users\asus\Downloads\1.mp4'))
# print(get_photo_exif(r'C:\Users\asus\Downloads\2.mp4'))
# print(get_photo_exif(r'web\assets\no_geo.jpg'))
































