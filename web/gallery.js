try{
    ymaps.ready(init);
}
catch(error){
    console.log(error)
}


window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

eel.get_gallery_photos()(function(data){
    // Контейнер для серии фото с датой и локацией
    const categoryConteiner = document.querySelector('.category-conteiner')

    let conteinerCollection = document.createElement("div")

    // Создание элементов 
    let titleDataLocation = document.createElement("div")
    let imgConteiner = document.createElement("div")


    // Присвоение знаечний 
    let group_id_prev = null
    for(let i = 0; i < data.length; i++){

        let group_id_current = data[i][4]

        if(group_id_current == group_id_prev){

            let img = document.createElement("img")
            img.setAttribute('src', data[i][1])
            img.onclick = function(){
                eel.save_id(data[i][0])
                GoPhotoPage()
            }
            imgConteiner.appendChild(img)


            let location = data[i][2]
            let dataTime = data[i][3]


            titleDataLocation.innerText = dataTime + ' | ' + location
            titleDataLocation.classList.add('label-container')
            imgConteiner.classList.add('img-container')


            conteinerCollection.classList.add("conteiner-collection")
            conteinerCollection.appendChild(titleDataLocation)
            conteinerCollection.appendChild(imgConteiner)

            // Добавление в главный контейнер 
            categoryConteiner.appendChild(conteinerCollection)
        }
        else{

            // Создание элементов 
            titleDataLocation = document.createElement("div")
            imgConteiner = document.createElement("div")


            let img = document.createElement("img")
            img.setAttribute('src', data[i][1])
            img.onclick = function(){
                eel.save_id(data[i][0])
                GoPhotoPage()
                
            }
            imgConteiner.appendChild(img)
    
            let location = data[i][2]
            let dataTime = data[i][3]

 
            titleDataLocation.innerText = dataTime + ' | ' + location

            titleDataLocation.classList.add('label-container')
            titleDataLocation.classList.add('text-header2')
            imgConteiner.classList.add('img-container')

            conteinerCollection = document.createElement("div")
            conteinerCollection.classList.add("conteiner-collection")
            conteinerCollection.appendChild(titleDataLocation)
            conteinerCollection.appendChild(imgConteiner)

            // Добавление в главный контейнер 
            categoryConteiner.appendChild(conteinerCollection)
        }
        group_id_prev = group_id_current
    }

})


eel.set_value()(function(response){
    let name_ru = response[1]
    let name_eng = response[3]
    let name_lat = response[4]

    document.getElementById("name_ru").innerHTML = name_ru
    document.getElementById("name_lat").innerHTML = name_eng
    document.getElementById("name_eng").innerHTML = name_lat
})





// Яндекс карта
async function init(){

    var myMap = new ymaps.Map("map", {
        center: [43., 131.90],
        controls: ['zoomControl'],
        suppressMapOpenBlock: true,
        zoom: 3
        });

    var myGeoObjects = [];

    var coords = await eel.get_coords_all_photos()()

    console.log(coords)

    for (var i = 0; i < coords.length; i++) {
        myGeoObjects[i] = new ymaps.GeoObject({
            geometry: {
                type: "Point",
                coordinates: coords[i]
                }
            });
    }

    var myClusterer = new ymaps.Clusterer();
    myClusterer.add(myGeoObjects);
    myMap.geoObjects.add(myClusterer);
}


function Search(){
    let inputValue = document.getElementById("search").value.trim()
    console.log(inputValue)


    let list = document.querySelectorAll(".category-conteiner .label-container")
    console.log(list.length)


    if(inputValue){
        list.forEach(elem => {
            if(elem.innerHTML.toLocaleLowerCase().search(inputValue) == -1){
                elem.parentElement.classList.add("hide")
            }
        })
    }
    else{
        list.forEach(elem =>{
            elem.parentElement.classList.remove("hide")
        })
    }
}


function ClearSearch(){
    document.getElementById("search").value = ""
    document.querySelectorAll(".category-conteiner .label-container").forEach(elem =>{
        elem.parentElement.classList.remove("hide")
    })
}


function SortModeReverse(){
    const elements = document.querySelectorAll(".category-conteiner .conteiner-collection");
    const reversedElements = Array.prototype.slice.call(elements).reverse();

    document.querySelector('.category-conteiner').replaceChildren()

    reversedElements.forEach(elem =>{
        document.querySelector('.category-conteiner').appendChild(elem)
    })
}

document.getElementById("date-early").addEventListener("change",SortModeReverse)

document.getElementById("date-later").addEventListener("change",SortModeReverse)

