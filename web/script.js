const PLACEHOLD_PATH = "http://placehold.it/150x150"

let fileDialogValue = PLACEHOLD_PATH
let TITLE = '';


async function CreateCardVid(id, title, img_path = PLACEHOLD_PATH){
    let div = document.createElement("div");
    let divName = document.createElement("div");
    let img = document.createElement("img");
    let name = document.createTextNode(`${title}`);

    let conteinerDiv = document.querySelector("div.conteiner");


    // Создание кнопок: удалить, изменить
    let btnFunctionDelete = document.createElement("button");
    btnFunctionDelete.classList.add('btn-function-delete')
    btnFunctionDelete.onclick = function(){
        Delete(id)
    }


    let btnFunctionEdit = document.createElement("button");
    btnFunctionEdit.classList.add('btn-function-edit')
    btnFunctionEdit.onclick = function(){
        Edit(id)
    }


    let divConteinerBtnFunction = document.createElement("div");
    divConteinerBtnFunction.classList.add('conteiner-btn-function')
    divConteinerBtnFunction.appendChild(btnFunctionDelete)
    divConteinerBtnFunction.appendChild(btnFunctionEdit)


    div.classList.add('vid')
    div.setAttribute('id', `${id}`)
    img.onclick = function(){
        TITLE = title
        OpenPageAbout(title)
    }
    divName.classList.add('vid-name')
    divName.onclick = function(){
        OpenPageAbout(title)
    }

    if (img_path != PLACEHOLD_PATH){
        img.setAttribute('src', `data:image/jpeg;base64,${img_path}`)
        img.setAttribute('height', '150')
        img.setAttribute('width', '150')
    }
    else{
        img.setAttribute('src', img_path)
        img.setAttribute('height', '150')
        img.setAttribute('width', '150')
    }

    divName.appendChild(name);
    div.appendChild(img);
    div.appendChild(divName);
    div.appendChild(divConteinerBtnFunction);
    conteinerDiv.appendChild(div);
}


function OpenModal(){
    document.getElementById("modal-uploadPhoto").classList.add("open")
}

document.getElementById("addCategory").addEventListener("click", function(){
    document.getElementById("modal").classList.add("open")
})


document.getElementById("btnCloseModal").addEventListener("click", function(){
    document.getElementById("modal").classList.remove("open")
})


document.getElementById("btnCloseModal-Upload").addEventListener("click", function(){
    document.getElementById("modal-uploadPhoto").classList.remove("open")
})



async function Confirm(){
    let name = document.getElementById("inputName").value

    if(name == ''){
        alert('Поле название пусто')
    }
    else{
        // Добавление в базу данных 
        // Созадние карточки
        
        // Очищение занчениеи fileDialogValue
        eel.add_to_db(name, fileDialogValue)
      
        // CreateCardVid(name, await eel.get_last_image()())
        
        fileDialogValue = PLACEHOLD_PATH

        document.getElementById("modal").classList.remove("open")
        document.getElementById("inputName").value = ''


        location.reload()
    }

}


async function OpenFileDialog(){
    fileDialogValue =  await eel.OpenFileDialog()()
    console.log(fileDialogValue)
}


async function OpenFilesDialog(){
    fileDialogValue =  await eel.OpenFilesDialog()()
}


eel.parse()(function(mas) {
    for (let i = 0; i < mas.length; i++) {
        let innerMas = mas[i];

        let id = innerMas[0]
        let title = innerMas[1];
        let img_path = innerMas[2];

        CreateCardVid(id, title, img_path)
    }
});





function Edit(id){
    if(window.confirm('Вы хотите езменить елемент?')){
        let newName = prompt("Введите название")
        eel.edit_title(id, newName)
    }

    location.reload()
}


function Delete(id){

    if(confirm('Вы хотите удалить елемент?')){
        eel.delete_view_by_id(id)

        const divVid = document.getElementById(`${id}`)
        const divConteiner = document.querySelector('.conteiner')

        divConteiner.removeChild(divVid)
    }
}


eel.fill_combobox_values()(function(list){
    let combobox = document.getElementById('combobox')

    for(let i = 0; i < list.length; i++){
        let option = document.createElement("option")
        option.text = list[i]
        combobox.appendChild(option)
    }
})


async function ConfirmUploadPhoto(){
    let combobox = document.getElementById("combobox").value
    let datapicker = document.getElementById("datapicker").value
    let place = document.getElementById("place").value
    let shirota = document.getElementById("shirota").value
    let dolgota = document.getElementById("dolgota").value
    let camera = document.getElementById("camera").value

    // Валидация 
    if(fileDialogValue == PLACEHOLD_PATH)
    {
        alert("Выберите фотографию")
    }

    else if(datapicker == ''){
        alert("Выберите дату")
    }

    else if(place == ''){
        alert("Выберите place")
    }

    else if(shirota == ''){
        alert("Выберите shirota")
    }

    else if(dolgota == ''){
        alert("Выберите dolgota")
    }

    else if(camera == ''){
        alert("Выберите camera")
    }
    else{
        let group_id = await eel.generate_group_id()();
        for (let i = 0; i < fileDialogValue.length; i++){

            let list = []
            list.push(fileDialogValue[i])
            list.push(combobox)
            list.push(datapicker)
            list.push(place)
            list.push(shirota)
            list.push(dolgota)
            list.push(camera)
            list.push(group_id)
            console.log(list)

            eel.put_data_to_db(list)
        }
        alert("Фотографии добавлены в галлерею")
    }
}


// Перемещение маркера карты при
// измении поля ввода координат
var placeMark


function editInput(){
    var shirotaValue = document.getElementById('shirota').value
    var dolgotaValue = document.getElementById('dolgota').value

    placeMark.geometry.setCoordinates([shirotaValue, dolgotaValue]);
}


// Яндекс карта
function init(){
    // Создание карты.
    var myMap = new ymaps.Map("map", {
        center: [43., 131.90],
        controls: ['zoomControl'],
        suppressMapOpenBlock: true,
        zoom: 8
    });


    // Создание маркера
    placeMark = new ymaps.Placemark([43., 131.90],
    { hintContent: 'Мой маркер'},
    {draggable: true});

    placeMark.events.add('dragend', function (event) {
        // Получение новых координат маркера
        var newCoordinates = event.get('target').geometry.getCoordinates();
      
        // Присвоение значений широты и долготы в поля ввода
        document.getElementById('shirota').value = newCoordinates[0].toPrecision(8);
        document.getElementById('dolgota').value = newCoordinates[1].toPrecision(8);
      });

    placeMark.events.add('drag', function (event) {
        // Получение новых координат маркера
        var newCoordinates = event.get('target').geometry.getCoordinates();
      
        // Присвоение значений широты и долготы в поля ввода
        document.getElementById('shirota').value = newCoordinates[0].toPrecision(8);
        document.getElementById('dolgota').value = newCoordinates[1].toPrecision(8);
    });

    myMap.geoObjects.add(placeMark);
}


function Search(){
    let inputValue = document.getElementById("search").value.trim()
    console.log(inputValue)

    let list = document.querySelectorAll(".conteiner .vid-name")
    console.log(list.length)

    if(inputValue){
        list.forEach(elem =>{
            if (elem.innerHTML.toLocaleLowerCase().search(inputValue) == -1){
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

function ClearCearch(){
    document.getElementById("search").value = ""
    document.querySelectorAll(".conteiner .vid-name").forEach(elem =>{
        elem.parentElement.classList.remove("hide")
    })
}