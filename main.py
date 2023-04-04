import eel


@eel.expose
def my_python_function(a, b):
    return a + b

@eel.expose
def name(name="Название"):
    print(name)

eel.init("web")

eel.start("main.html", size=(1920, 1080), position=(200,200))