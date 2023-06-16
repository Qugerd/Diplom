import base64
import os
import eel
import librosa
from datetime import datetime
import tempfile
import shutil



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


def absolute_path_to_relative_path():
    # Определяем путь к временной директории от корня проекта
    temp_dir_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'temp')

    # Если директория для временных файлов не существует, создаем ее
    if not os.path.exists(temp_dir_path):
        os.makedirs(temp_dir_path)

    # Задаем ссылку на файл
    file_url = "D:/Projects/Диплом/web/assets/images/01770024703.jpg"

    # Определяем путь для копии файла
    file_name = os.path.basename(file_url)
    dest_path = os.path.join(temp_dir_path, file_name)

    # Копируем файл
    shutil.copy(file_url, dest_path)

    # Получаем относительный путь до скопированного файла
    rel_path = os.path.relpath(dest_path, os.path.dirname(os.path.abspath(__file__)))

    # Выводим информацию о временной директории и скопированном файле
    print("Временная директория: ", temp_dir_path)
    print("Скопированный файл: ", dest_path)
    print("Относительный путь до файла: ", rel_path)

    # Удалить всю папку
    # shutil.rmtree(temp_dir_path)
    # # Удаляем все файлы из временной директории
    # for file_name in os.listdir(temp_dir_path):
    #     file_path = os.path.join(temp_dir_path, file_name)
    #     try:
    #         if os.path.isfile(file_path):
    #             os.remove(file_path)
    #     except Exception as e:
    #         print(e)

