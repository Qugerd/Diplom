import eel
import tkinter as tk
from tkinter import filedialog


@eel.expose
def my_python_function(a, b):
    return a + b


@eel.expose
def name(name="Название"):
    print(name)


@eel.expose
def OpenFileDialog():
    root = tk.Tk()
    root.withdraw()

    file_path = filedialog.askopenfilename()
    print(file_path)


@eel.expose
def Parse():
    print("hi")








eel.init("web")
eel.start("main.html", size=(1920, 1080), position=(200,200))