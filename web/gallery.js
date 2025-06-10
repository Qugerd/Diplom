try{
    ymaps.ready(init);
}
catch(error){
    console.log(error)
}


window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});


// Функция для показа/скрытия индикатора загрузки
function showLoadingIndicator(total) {
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'loading-indicator';
    loadingIndicator.innerHTML = `
        <div class="loading-content">
            <div class="spinner"></div>
            <div class="loading-text">Загрузка фотографий...</div>
        </div>
    `;
    document.body.appendChild(loadingIndicator);
    return loadingIndicator;
}

function hideLoadingIndicator(loadingIndicator) {
    if (loadingIndicator) {
        loadingIndicator.classList.add('fade-out');
        setTimeout(() => loadingIndicator.remove(), 300);
    }
}

// Показываем индикатор загрузки ДО вызова API
const loadingIndicator = showLoadingIndicator();

// Получаем данные
eel.get_gallery_photos()(function(data) {
    // Скрываем индикатор когда данные получены
    hideLoadingIndicator(loadingIndicator);

    // Основной контейнер
    const categoryConteiner = document.querySelector('.category-conteiner');
    categoryConteiner.innerHTML = ''; // Очищаем перед загрузкой новых данных

    // Переменные для группировки
    let currentGroupId = null;
    let currentConteinerCollection = null;
    let currentImgConteiner = null;

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const group_id_current = item[4];

        // Логика группировки
        if (group_id_current !== currentGroupId) {
            // Создание новой группы
            currentConteinerCollection = document.createElement("div");
            currentConteinerCollection.classList.add("conteiner-collection");
            
            const titleDataLocation = document.createElement("div");
            currentImgConteiner = document.createElement("div");
            
            titleDataLocation.innerText = item[3] + ' | ' + item[2];
            titleDataLocation.classList.add('label-container', 'text-header2');
            
            // Кнопка добавления
            const container_btn_add_photo_to_collection = document.createElement('div');
            const icon_btn_add_photo_to_collection = document.createElement('div');
            const btn_add_photo_to_collection = document.createElement('div');
            
            btn_add_photo_to_collection.innerHTML = "Добавить фотографию к коллекции";
            btn_add_photo_to_collection.classList.add("btn_add_photo_to_collection");
            btn_add_photo_to_collection.onclick = async function() {
                var photo_path = await eel.OpenFileDialog()();
                if (photo_path) {
                    eel.add_photo_gallery_collection(photo_path, item[3], item[2], item[5], item[6], group_id_current);
                    window.location.reload();
                }
            };

            container_btn_add_photo_to_collection.classList.add("container_btn_add_photo_to_collection");
            icon_btn_add_photo_to_collection.classList.add("icon_btn_add_photo_to_collection");
            container_btn_add_photo_to_collection.appendChild(icon_btn_add_photo_to_collection);
            container_btn_add_photo_to_collection.appendChild(btn_add_photo_to_collection);
            
            titleDataLocation.appendChild(container_btn_add_photo_to_collection);
            currentImgConteiner.classList.add('img-container');
            
            currentConteinerCollection.appendChild(titleDataLocation);
            currentConteinerCollection.appendChild(currentImgConteiner);
            categoryConteiner.appendChild(currentConteinerCollection);
            
            currentGroupId = group_id_current;
        }

        // Добавление изображения
        if (item[1] === "") {
            let empty_div = document.createElement("div");
            empty_div.classList.add("empty_img");
            empty_div.innerHTML = "Путь изображения изменен";
            empty_div.onclick = function() {
                eel.save_id(item[0]);
                GoPhotoPage();
            };
            currentImgConteiner.appendChild(empty_div);
        } else {
            let img = document.createElement("img");
            img.src = item[1];
            img.alt = 'Путь до файла изменён';
            img.onclick = function() {
                eel.save_id(item[0]);
                GoPhotoPage();
            };
            currentImgConteiner.appendChild(img);
        }
    }
});


















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

    var data = await eel.get_gallery_photos()()

    console.log(data)

    for (var i = 0; i < data.length; i++) {
        myGeoObjects[i] = new ymaps.Placemark(
            [data[i][5], data[i][6]],
            {
                balloonContent:
                `
                <div class="kek" onclick="
                    eel.save_id(${data[i][0]});
                    GoPhotoPage();
                    " style="cursor: pointer;">
                                    ${data[i][2]} <br>
                                    ${data[i][3]}<br>
                                    <img src="${data[i][1]}" style="hieght: 150px;">
                                </div>
                `,
                clusterCaption: `${i}-я фотография`
            }
        )
    }

    var myClusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true
    });
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

