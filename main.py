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
def parse():
    return ParseDB()


@eel.expose
def add_to_db(name, imgPath):
    AddInDB(name, imgPath)


@eel.expose
def get_last_image():
    return GetLastImage()


eel.init("web")
eel.start("main.html", size=(1920, 1080), position=(200,200))