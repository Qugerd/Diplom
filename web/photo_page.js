ymaps.ready(init);

let ID; 
let absolute_path;
let likeValue;

eel.get_photo()(async function(data){
    console.log(data)

    ID = data[0]
    const photo_path = data[1]
    const kind = data[2]
    const date = data[3]
    const place = data[4]
    const latittude = data[5]
    const longitude = data[6]
    const camera = data[7]
    const group_id = data[8]
    const note = data[9]
    likeValue = data[10]
    absolute_path = data[11]


    let data_view = await eel.set_value()()
    console.log(data_view)


    const name_ru = data_view[1]
    const name_lat = data_view[3]
    const name_eng = data_view[4]


    document.getElementById("name_ru").innerHTML = name_ru
    document.getElementById("name_eng").innerHTML = name_eng
    document.getElementById("name_lat").innerHTML = name_lat


    const image = document.getElementById("image")
    image.setAttribute('src', photo_path)
    // image.setAttribute('width', '1200')
    // image.setAttribute('height', '705')


    document.getElementById('notes_text').innerHTML = note


    document.getElementById('place').innerHTML = "Местоположение: " + place
    document.getElementById('date').innerHTML = "Дата: " + date
    document.getElementById('camera').innerHTML = "Камера: " + camera


    const btnLike = document.getElementById("like")
    if(likeValue == 1){
        btnLike.style.backgroundColor = "#ffd000"
        btnLike.style.borderRadius = "50%"
    }
})


function EditNotes(){
    const conteinetNotes = document.querySelector(".conteiner-notes")

    const divText =  document.getElementById('notes_text')
    let rememberText = divText.innerHTML
    divText.innerHTML = ""


    const textarea = document.createElement('textarea')
    textarea.value = rememberText
    textarea.classList.add('text')


    const btn = document.createElement('button')
    btn.setAttribute('id', 'btn')
    btn.textContent = "Confirm"
    btn.onclick = function(){
        Confirm()
    }


    conteinetNotes.appendChild(textarea)
    conteinetNotes.appendChild(btn)
    conteinetNotes.removeChild
}


function Confirm(){
    const text = document.querySelector("textarea").value
    eel.edit_notes(ID, text)

    document.getElementById('notes_text').innerHTML = text
    Remove()
}


function Remove(){
    document.querySelector('textarea').remove()
    document.getElementById('btn').remove()
}



// Карта
async function init(){
    // Создание карты.
    var coords = await eel.get_coords_photo()()
    var myMap = new ymaps.Map("map", {
        center: coords,
        controls: ['zoomControl'],
        suppressMapOpenBlock: true,
        zoom: 11
    });


    var myPlacemark = new ymaps.Placemark(coords);
    myMap.geoObjects.add(myPlacemark);
}



function OpenFolder(){
    eel.open_folder(absolute_path)
}

document.getElementById("like").addEventListener("click", function(){
    if(likeValue == 1){
        eel.update_like_photo("", ID)
        
        this.style.backgroundColor = "white"
        this.style.borderRadius = "50%"
    }
    else{
        eel.update_like_photo(1, ID)
        this.style.backgroundColor = "#ffd000"
        this.style.borderRadius = "50%"
    }
})


function DeletePhoto(){
    eel.delete_photo(ID)
    GoGallery()
}


function Redact(){
    GoPhotoRedactorPage()
}
