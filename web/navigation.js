function OpenPageAbout(title){
    eel.save_value(title)
    window.location.replace("about.html")
}

function GoHome(){
    window.location.replace("main.html")
    eel.delete_temp_dir()
}

function GoAbout(){
    window.location.replace("about.html")
}

function GoGallery(){
    window.location.replace("gallery.html")
}

function GoPhotoPage(){
    window.location.replace("photo_page.html")
}

function GoFavoritePhotos(){
    window.location.replace("favorite_photos.html")
}

function GoVideoPage(){
    window.location.replace("video.html")
}

function GoSoundPage(){
    window.location.replace("sound.html")
}

function GoPhotoRedactorPage(){
    window.location.replace("photo_redactor.html")
}

