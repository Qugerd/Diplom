eel.set_value()(function(response){
    console.log(response) 
    const name_ru = response[1]
    const name_lat = response[3]
    const name_eng = response[4]
    const image_path = response[2]
    const description = response[5]
    const spreading = response[6]
    const biology = response[7]


    document.getElementById("name_ru").innerHTML = name_ru
    document.getElementById("name_lat").innerHTML = name_lat
    document.getElementById("name_eng").innerHTML = name_eng
    document.getElementById("description").innerHTML = description
    document.getElementById("spreading").innerHTML = spreading
    document.getElementById("biology").innerHTML = biology
    document.getElementById("image").setAttribute('src', `data:image/jpeg;base64,${image_path}`)
})


function GoHome(){
    window.location.replace("main.html")
}

function GoAbout(){
    window.location.replace("about.html")
}

function GoGallery(){
    window.location.replace("gallery.html")
}