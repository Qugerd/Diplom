import eel
import tkinter as tk
from tkinter import filedialog


@eel.expose
def OpenFileDialog():
    root = tk.Tk()
    root.withdraw()

    file_path = filedialog.askopenfilename()
    print(file_path)


@eel.expose
def parse():
    return 0







eel.init("web")
eel.start("main.html", size=(1920, 1080), position=(200,200))