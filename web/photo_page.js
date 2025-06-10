try{
    ymaps.ready(init);
}
catch(error){
    console.log(error)
}

let ID; 
let absolute_path;
let likeValue;


window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

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
    const lens = data[11]
    absolute_path = data[12]



    let data_view = await eel.set_value()()
    console.log(data_view)


    const name_ru = data_view[1]
    const name_lat = data_view[3]
    const name_eng = data_view[4]


    document.getElementById("name_ru").innerHTML = name_ru
    document.getElementById("name_eng").innerHTML = name_eng
    document.getElementById("name_lat").innerHTML = name_lat

    if (photo_path == ""){
        document.getElementById('empty_container').classList.add('open')
    }

    const image = document.getElementById("image")
    image.setAttribute('src', photo_path)
    // image.setAttribute('width', '1200')
    // image.setAttribute('height', '705')



    LoadPhotoVersion()
    GetPhotosSeries(group_id)


    document.getElementById('notes_text').innerHTML = note


    document.getElementById('place').innerHTML = "Местоположение: " + place
    document.getElementById('date').innerHTML = "Дата: " + date
    document.getElementById('camera').innerHTML = "Камера: " + camera
    document.getElementById('lens').innerHTML = "Объектив: " + lens


    const btnLike = document.getElementById("like")
    const svgPath = btnLike.querySelector('svg path');

    if(likeValue == 1){
        svgPath.setAttribute('fill', '#ffd000')
    }
})



// Загрузка версий главной фотогрофии
async function LoadPhotoVersion(){
    let data_photo = await eel.get_photos_version(ID)()

    const container_image_version = document.getElementById('container_image_version')
    let currentPhotoPath;
    let id_photo;

    console.log(data_photo)
    for (let i = 0; i < data_photo.length; i++){

        if (data_photo[i][2] == ""){
            let empty_div = document.createElement("div")
            empty_div.classList.add("empty_div")
            empty_div.innerHTML = "Путь изображения изменен"
            empty_div.onclick = function(){
                document.getElementById('modal').classList.add('open_modal')
                document.getElementById('img_version').setAttribute('src', data_photo[i][2])
                currentPhotoPath = data_photo[i][3]
                id_photo = data_photo[i][0]
            }
            container_image_version.prepend(empty_div)
        }
        else{
            const img = document.createElement('img')
            img.setAttribute('src', data_photo[i][2])
            img.onclick = function(){
                document.getElementById('modal').classList.add('open_modal')
                document.getElementById('img_version').setAttribute('src', data_photo[i][2])
                currentPhotoPath = data_photo[i][3]
                id_photo = data_photo[i][0]
            }
            container_image_version.prepend(img)
        }




        document.getElementById('delete_photo').onclick = function(){
            eel.delete_photo_version(id_photo)
            location.reload()
        }


        document.getElementById('btn_open_in_folder').onclick = function(){
            eel.open_folder(currentPhotoPath)
        }
    }
}



// Загрузка фотографий тойже серии
async function GetPhotosSeries(group_id){
    const container_series_photos = document.getElementById('container_series_photos')

    let photos = await eel.get_group_photos(ID, group_id)()
    console.log(photos)

    for (let i = 0; i < photos.length; i++){
        const image = document.createElement('img')

        if (photos[i][1] == ""){
            const empty_div = document.createElement('div')
            empty_div.innerHTML = "Путь изображения изменён"
            empty_div.classList.add("empty_div")
            empty_div.onclick = function(){
                eel.save_id(photos[i][0])
                GoPhotoPage()
            }
            container_series_photos.appendChild(empty_div)
        }
        else{
            image.setAttribute('src', photos[i][1])
            image.onclick = function(){
                eel.save_id(photos[i][0])
                GoPhotoPage()
            }
            container_series_photos.appendChild(image)
        }
    }
}



async function ChangePhotoPath(){
    let new_path = await eel.OpenFileDialog()()

    eel.edit_photo_path(ID, new_path)
    GoPhotoPage()
}


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

    const svgPath = this.querySelector('svg path');


    if(likeValue == 1){
        eel.update_like_photo("", ID)
        svgPath.setAttribute('fill', '#333')
    }
    else{
        eel.update_like_photo(1, ID)
        svgPath.setAttribute('fill', '#ffd000')
    }
})


function DeletePhoto(){
    eel.delete_photo(ID)
    GoGallery()
}


function Redact(){
    GoPhotoRedactorPage()
}

async function AddPhotoVertion(){
    const photo_path = await eel.OpenFileDialog()()
    eel.add_photo_version(ID, photo_path)
    location.reload()
}


function CloseModalPhoto(){
    document.getElementById('modal').classList.remove('open_modal')
}
