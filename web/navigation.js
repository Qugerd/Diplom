function OpenPageAbout(title){
    eel.save_value(title)
    window.location.replace("about.html")
}

function GoHome(){
    window.location.replace("main.html")
}

function GoAbout(){
    window.location.replace("about.html")
}

function GoGallery(){
    eel.get_gallery_photos()
    window.location.replace("gallery.html")
}