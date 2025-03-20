import eel
from PIL import Image
from support import absolute_path_to_relative_path
import uuid
import os
import shutil
from pathlib import Path

def photo_edit_function():

    @eel.expose
    def rotate_right(photo_path):
        print(photo_path)
        image = Image.open(photo_path)
        rotate_image = image.rotate(-90, resample=True)

        file_name, file_extension = os.path.splitext(os.path.basename(photo_path))
        copy_file_name = f'{file_name}_copy{file_extension}'

        path_folder = 'web/temp/'
        path_save = os.path.join(path_folder, copy_file_name)

        rotate_image.save(path_save)

        return path_save.replace('web/', '')






# def copy_image():
#     source_image_path = r"web\temp\903c9cc3e28194879f25d3235469217d.jpg"
#     print(source_image_path)
#     image = Image.open(source_image_path)

#     rotate_image = image.rotate(-90, resample=True)
#     rotate_image.save('rotate.jpg')

#     copy_image_path = 'D:\\Projects\\Diplom\\web\\temp\\copy.jpg'
#     shutil.copy(source_image_path, copy_image_path)


# copy_image()



