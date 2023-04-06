import eel
import tkinter as tk
from tkinter import filedialog
from database import ParseDB


@eel.expose
def OpenFileDialog():
    root = tk.Tk()
    root.withdraw()

    file_path = filedialog.askopenfilename()
    print(file_path)


@eel.expose
def parse():
    return ParseDB()


eel.init("web")
eel.start("main.html", size=(1920, 1080), position=(200,200))