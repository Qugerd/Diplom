import eel


def text_changer():
    return "text changed"

@eel.expose
def my_python_function(a, b):
    return a + b

@eel.expose
def retrieve():
    eel.show('about.html')
    
eel.init("web")

eel.start("main.html")