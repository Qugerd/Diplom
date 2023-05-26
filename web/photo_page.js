ymaps.ready(init);

let ID; 

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


    let data_view = await eel.set_value()()
    console.log(data_view)


    const name_ru = data_view[1]
    const name_lat = data_view[3]
    const name_eng = data_view[4]


    document.getElementById("name_ru").innerHTML = name_ru
    document.getElementById("name_eng").innerHTML = name_eng
    document.getElementById("name_lat").innerHTML = name_lat


    const image = document.getElementById("image")
    image.setAttribute('src', 'http://localhost:8000/' + photo_path)
    image.setAttribute('width', '980')
    image.setAttribute('height', '640')


    document.getElementById('notes_text').innerHTML = note


    document.getElementById('place').innerHTML = "Местоположение: " + place
    document.getElementById('date').innerHTML = "Дата: " + date
    document.getElementById('camera').innerHTML = "Камера: " + camera
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
    if (confirm("Вы хотите внести изменения ?")){
        const text = document.querySelector("textarea").value
        eel.edit_notes(ID, text)

        document.getElementById('notes_text').innerHTML = text
        Remove()
    }
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
        // Координаты центра карты.
        // Порядок по умолчанию: «широта, долгота».
        // Чтобы не определять координаты центра карты вручную,
        // воспользуйтесь инструментом Определение координат.
        center: coords,
        controls: ['zoomControl'],
        suppressMapOpenBlock: true,
        // Уровень масштабирования. Допустимые значения:
        // от 0 (весь мир) до 19.
        zoom: 11
    });


    var myPlacemark = new ymaps.Placemark(coords);
    myMap.geoObjects.add(myPlacemark);
}