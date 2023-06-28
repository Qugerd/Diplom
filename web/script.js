const PLACEHOLD_PATH = "http://placehold.it/150x150"

let fileDialogValue = PLACEHOLD_PATH



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
        Delete(id, title)
    }


    let btnFunctionEdit = document.createElement("button");
    btnFunctionEdit.classList.add('btn-function-edit')
    btnFunctionEdit.onclick = function(){
        Edit(id, title)
    }


    let divConteinerBtnFunction = document.createElement("div");
    divConteinerBtnFunction.classList.add('conteiner-btn-function')
    divConteinerBtnFunction.appendChild(btnFunctionDelete)
    divConteinerBtnFunction.appendChild(btnFunctionEdit)


    div.classList.add('vid')
    div.setAttribute('id', `${id}`)
    img.onclick = function(){
        const divVid = document.getElementById(`${id}`)
        title = divVid.children[1].innerHTML
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

document.getElementById("btnCloseModal-Class").addEventListener("click", function(){
    document.getElementById("modal-newClass").classList.remove("open")
})

document.getElementById("addClass").addEventListener("click", async function(){
    document.getElementById("modal-newClass").classList.add("open")
    CreateViewBox()
    CreateFamilyBox()
    let squads = await eel.get_all_squad()()
    CreateSquadBox(squads)
})

async function CreateViewBox(){
    let viewBox = document.getElementById("viewBox")
    $(viewBox).empty();
    let views = await eel.get_all_view()()


    for(let i = 0; i < views.length; i++){
        let option = document.createElement("option")
        option.text = views[i]
        viewBox.appendChild(option)
    }


}


async function CreateFamilyBox(){
    let familyBox = document.getElementById("familyBox")
    $(familyBox).empty();

    let familys =  await eel.get_all_family()()
    for(let i = 0; i < familys.length; i++){
        let option = document.createElement("option")
        option.text = familys[i][1]
        option.value = familys[i][0]
        familyBox.appendChild(option)
    }
}


async function Confirm(){
    let name = document.getElementById("inputName").value
    let name_lat = document.getElementById("inputLat").value
    let name_eng = document.getElementById("inputEng").value

    let description = document.getElementById("ta-description").value
    let spreading = document.getElementById("ta-place").value
    let biology = document.getElementById("ta-bio").value



    if(name == ''){
        Alert('Поле "Название вида" пустое')
    }
    else{
        // Добавление в базу данных 
        // Созадние карточки
        
        // Очищение занчениеи fileDialogValue
        eel.add_to_db(name, fileDialogValue, name_lat, name_eng, description, spreading, biology)
      
        // CreateCardVid(name, await eel.get_last_image()())
        
        fileDialogValue = PLACEHOLD_PATH

        document.getElementById("modal").classList.remove("open")
        document.getElementById("inputName").value = ''


        location.reload()
    }

}


async function OpenFileDialog(){
    fileDialogValue =  await eel.OpenFileDialog()()
    if(fileDialogValue){
        document.getElementById("fileValue").innerHTML = "Файл выбран: " + fileDialogValue
        document.getElementById("fileValue").style.color = "black"
    }else{
        document.getElementById("fileValue").innerHTML = "Файл не выбран!"
        document.getElementById("fileValue").style.color = "red"
    }
    console.log(fileDialogValue)
}


async function OpenFilesDialog(){
    fileDialogValue =  await eel.OpenFilesDialog()()
    if(fileDialogValue.length == 1){
        document.getElementById("files-value").innerHTML = "Файл выбран: " + fileDialogValue
        document.getElementById("files-value").style.color = "black"
    }
    else if(fileDialogValue.length == 0){
        document.getElementById("files-value").innerHTML = "Файл не выбран !"
        document.getElementById("files-value").style.color = "red"
    }
    else{
        let size = fileDialogValue.length
        document.getElementById("files-value").innerHTML = "Файлов выбрано: " + size
        document.getElementById("files-value").style.color = "black"
    }
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





async function Edit(id, title){

    let newName = await AlertPromt(title)
    eel.edit_title(id, newName, title)

    // меняю название на карточке вида
    const divVid = document.getElementById(`${id}`)
    divVid.children[1].innerHTML = newName


    // меняю название в комбобоксе
    let option = document.querySelectorAll("option")
    for(let i = 0; i < combobox.length; i++){
        if (option[i].innerText.trim() === title) {
            option[i].innerText = newName;
        }
    }
}


async function Delete(id, title){

    if(await AlertConfirm('Вы хотите удалить елемент?')){
        eel.delete_view_by_id(id, title)

        const divVid = document.getElementById(`${id}`)
        const divConteiner = document.querySelector('.conteiner')

        divConteiner.removeChild(divVid)

        let option = document.querySelectorAll("option")

        for(let i = 0; i < combobox.length; i++){
            if (option[i].innerText.trim() === title) {
                option[i].remove();
            }
        }
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
    let combobox = document.getElementById("combobox")
    let datapicker = document.getElementById("datapicker")
    let place = document.getElementById("place")
    let shirota = document.getElementById("shirota")
    let dolgota = document.getElementById("dolgota")
    let camera = document.getElementById("camera")
    console.log(fileDialogValue)
    // Валидация 
    if(fileDialogValue == PLACEHOLD_PATH || fileDialogValue == ""){
        Alert("Выберите фотографию")
    }

    else if(datapicker == ''){
        Alert("Выберите дату")
    }

    else if(place == ''){
        Alert("Выберите место съемки")
    }
    else{
        let group_id = await eel.generate_group_id()();
        for (let i = 0; i < fileDialogValue.length; i++){

            let list = []
            list.push(fileDialogValue[i])
            list.push(combobox.value)
            list.push(datapicker.value)
            list.push(place.value)
            list.push(shirota.value)
            list.push(dolgota.value)
            list.push(camera.value)
            list.push(group_id)

            document.getElementById("modal-uploadPhoto").classList.remove("open")
            document.getElementById("fileValue").innerHTML = "Файл выбран: пусто"

            console.log(list)
           Alert(await eel.put_data_to_db(list)())
        }
        dolgota.innerHTML = ""
        shirota.innerHTML = ""
        place.innerHTML = ""
        datapicker.innerHTML = ""
        camera.innerHTML = ""
        dolgota.innerHTML = ""
        shirota.innerHTML = ""
        fileDialogValue = ""
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

function Alert(text){
    document.getElementById("msg").innerHTML = text
    document.getElementById("modal-alert").classList.add("open")
    document.getElementById("btn-ok").addEventListener("click", function(){
        document.getElementById("modal-alert").classList.remove("open")
    })
}




function AlertConfirm(text) {
    return new Promise(function(resolve, reject) {
      document.getElementById('conf-msg').innerHTML = text;
      document.getElementById('modal-alert-confirm').classList.add('open');
  
      document.getElementById('conf-ok').addEventListener('click', function(){
        document.getElementById('modal-alert-confirm').classList.remove('open');
        resolve(true);
      });


      document.getElementById('conf-canсel').addEventListener('click', function(){
        document.getElementById('modal-alert-confirm').classList.remove('open');
        resolve(false);
      });
    });
}


function AlertPromt(title){
    return new Promise(function(resolve, reject) {
        document.getElementById('modal-alert-promt').classList.add("open")
        document.getElementById('promt-input').value = title

        document.getElementById('promt-ok').addEventListener('click', function(){
            document.getElementById('modal-alert-promt').classList.remove('open');
            let newtitle = document.getElementById('promt-input').value
            resolve(newtitle);
        });

        document.getElementById('promt-canсel').addEventListener('click', function(){
            document.getElementById('modal-alert-promt').classList.remove('open');
            reject("Canceled");
        });
    });
}


async function AddSquad(){
    let value = document.getElementById("inputSquad").value

    if (value){
        eel.add_squad(value)
        document.getElementById("inputSquad").value = ""


        let squads = await eel.get_all_squad()()

        CreateSquadBox(squads)
        ClearClassTable()
        CreateClassTable()
    }
    else{
        Alert("Введите название отряда")
    }
}


function AddFamily(){
    let valueInput = document.getElementById("inputFamily").value
    let valueId = document.getElementById("squadBox").value

    if (valueInput){
        eel.add_family(valueInput, valueId)
        document.getElementById("inputFamily").value = ''
        CreateFamilyBox()
        ClearClassTable()
        CreateClassTable()
    }
    else{
        Alert("Введите название семейства")
    }
}


function CreateSquadBox(squads){
    let box = document.getElementById("squadBox")
    $(box).empty();


    for(let i = 0; i < squads.length; i++){
        let option = document.createElement("option")
        option.value = squads[i][0]
        option.text = squads[i][1]


        box.appendChild(option)
    }
}


function ClearClassTable(){
    let squadConteiner = document.getElementById("squadConteiner")
    $(squadConteiner).empty();
}

async function CreateClassTable(){
    let squads = await eel.get_all_squad()()

    let squadConteiner = document.getElementById("squadConteiner")

    for(let i = 0; i < squads.length; i++){
        let squadTitle = document.createElement("div")
        squadTitle.classList.add("squad-title")
        squadTitle.innerHTML = squads[i][1]

        let squad_id = squads[i][0]

        let familys = await eel.get_all_family_by_id(squad_id)()
        // console.log(familys)

        let squadFamily = document.createElement("div")
        squadFamily.classList.add("squad-family")

        squadConteiner.appendChild(squadTitle)

        for (let j = 0; j < familys.length; j++){
            let familyTitle = document.createElement("div")
            familyTitle.classList.add("family-title")
            familyTitle.innerHTML = familys[j][1]



            squadFamily.appendChild(familyTitle)
            squadConteiner.appendChild(squadFamily)


            let familyId = familys[j][0]

            let views = await eel.get_view_in_family(familyId)()
            console.log(views)
            for (let k = 0; k < views.length; k++){
                let name = views[k][0]


                let familyVid = document.createElement("div")
                familyVid.classList.add("squad-family-vid")

                let vidTitle = document.createElement('div')
                vidTitle.classList.add("vid-title")
                vidTitle.style.fontSize = "16px"
                vidTitle.innerHTML = views[k][0]
                vidTitle.onclick = function (){
                    OpenPageAbout(name)
                }

                familyVid.appendChild(vidTitle)
                squadFamily.appendChild(familyVid)
            }
        }
    }
}


function AddViewToFamily(){
    let viewName = document.getElementById('viewBox').value
    let familyId = document.getElementById('familyBox').value
    eel.add_view_to_family(viewName, familyId)
    ClearClassTable()
    CreateClassTable()
}

CreateClassTable()