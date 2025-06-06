const PLACEHOLD_PATH = ""

let fileDialogValue = PLACEHOLD_PATH
let Title;


window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

async function CreateCardVid(id, title, img_path = PLACEHOLD_PATH){
    let div = document.createElement("div");
    let divName = document.createElement("div");
    let img = document.createElement("img");
    let name = document.createTextNode(`${title}`);

    let conteinerDiv = document.querySelector("div.conteiner");


    // Создание кнопок: удалить, изменить
    let btnFunctionDelete = document.createElement("button");
    btnFunctionDelete.classList.add('btn-function-delete')
    btnFunctionDelete.onclick = async function(){
        await Delete(id, title)
        ClearClassTable()
        await CreateClassTable()
    }


    let btnFunctionEdit = document.createElement("button");
    btnFunctionEdit.classList.add('btn-function-edit')
    btnFunctionEdit.onclick = function(){
        OpenModalEdite(id, title)
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
    CreateViewBox2()
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

document.getElementById("btnCloseModal-Edite").addEventListener("click", function(){
    document.getElementById("modal-edite").classList.remove("open")
})

document.getElementById("addClass").addEventListener("click", async function(){
    document.getElementById("modal-newClass").classList.add("open")
    CreateSquadBox()
    CreateFamilyBox()
})

document.getElementById('btn_open_map').addEventListener('click', function(){
    document.getElementById('modal_search_map').classList.add('open')
})

document.getElementById('btn_close_search_map').addEventListener('click', function(){
    document.getElementById('modal_search_map').classList.remove('open')
})

async function CreateViewBox2(){
    let viewBox = document.getElementById("viewBox2")
    $(viewBox).empty();
    let views = await eel.get_all_family()()


    for(let i = 0; i < views.length; i++){
        let option = document.createElement("option")
        option.text = views[i][1]
        option.value = views[i][0]
        viewBox.appendChild(option)
    }
}


async function Confirm(){
    let name = document.getElementById("inputName").value
    let name_lat = document.getElementById("inputLat").value
    let name_eng = document.getElementById("inputEng").value

    let description = document.getElementById("ta-description").value
    let spreading = document.getElementById("ta-place").value
    let biology = document.getElementById("ta-bio").value

    let family_id = document.getElementById('viewBox2').value



    if(name == ''){
        Alert('Поле "Название вида" пустое')
    }
    else if(fileDialogValue == ""){
        Alert('Выберите изображение !')
    }
    else{
        // Добавление в базу данных 
        // Созадние карточки
        
        // Очищение занчениеи fileDialogValue
        let response = await eel.add_to_db(name, fileDialogValue, name_lat, name_eng, description, spreading, biology, family_id)()
        
        if (response == true){
            document.getElementById("modal").classList.remove("open")
            document.getElementById("inputName").value = ''
            fileDialogValue = ""

            location.reload()
        }
        else{
            Alert(response)
        }
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


function CreateLabelsPath(paths){
    const filesValue = document.getElementById("files-value");
    console.log(paths)
    paths.forEach(path => {
        const container = document.createElement("div");
        container.dataset.path = path;
        container.classList.add("container_label_path");

        let label = document.createElement("div");
        label.classList.add("label_path");
        label.innerHTML = path.split(/[\\/]/).pop();

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "16");
        svg.setAttribute("height", "16");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.innerHTML = '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/>';
        svg.onclick = function() {
            container.remove();
        };

        container.appendChild(svg);
        container.appendChild(label);
        filesValue.insertAdjacentElement("afterend", container);
    });
}



async function AutoCompleteInfo(){
    let exif = "empty"
    let data = ""
    let lat = ""
    let lon = ""
    let city = ""
    let camera = ""

    file_list =  await eel.OpenFilesDialog()()
    console.log(file_list)
    fileDialogValue = file_list[0]

    if (fileDialogValue) {
        CreateLabelsPath(fileDialogValue)
    }


    exif = file_list[1]

    if(exif.length > 2){
        data = exif[0]
        lat = exif[1]
        lon = exif[2]
        city = exif[3]
        camera = exif[4]

        document.getElementById('datapicker').value = data
        document.getElementById('place').value = city
        document.getElementById('shirota').value = lat
        document.getElementById('dolgota').value = lon
        document.getElementById('camera').value = camera
    
        placeMark.geometry.setCoordinates([lat, lon]);
        myMap.setCenter([lat, lon])
    }
    else if(exif.length <= 2){
        data = exif[0]
        camera = exif[1]

        document.getElementById('datapicker').value = data
        document.getElementById('camera').value = camera

        console.log(data)
        console.log(camera)
    }






    // if(fileDialogValue.length == 1){
    //     document.getElementById("files-value").innerHTML = "Файл выбран: " + fileDialogValue
    //     document.getElementById("files-value").style.color = "black"
    // }
    // else if(fileDialogValue.length == 0){
    //     document.getElementById("files-value").innerHTML = "Файл не выбран !"
    //     document.getElementById("files-value").style.color = "red"
    // }
    // else{
    //     let size = fileDialogValue.length
    //     document.getElementById("files-value").innerHTML = "Файлов выбрано: " + size
    //     document.getElementById("files-value").style.color = "black"
    // }
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


async function OpenModalEdite(id, title){
    document.getElementById("modal-edite").classList.add("open")

    document.getElementById("inputEditeTitle").value = title
    ID = id
    Title = title

    CreateViewBox()
}


function RenameTitle(){
    let newName = document.getElementById("inputEditeTitle").value
    let id = ID
    let title = Title
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

    ClearClassTable()
    CreateClassTable()
}


async function ChangePreview(){
    let image = await eel.OpenFileDialog()()

    if(image){
        eel.change_preview(ID, image)
        window.location.reload()
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



    const container_label_path = document.querySelectorAll(".container_label_path")
    const paths = Array.from(container_label_path).map(container => container.dataset.path);
    // console.log(paths)
    const containerLabelLink = document.querySelectorAll(".container_label_link")
    const links = Array.from(containerLabelLink).map(container => container.dataset.path);

    if (paths.length === 0 && links.length === 0) {
        Alert("Выберите фотографию на устройстве или вставте ссылку на изображение")
    }
    else if(datapicker.value == ''){
        Alert("Выберите дату")
    }
    else if(place.value == ''){
        Alert("Укажите место съемки")
    }
    else{
        let paths_and_links = [...paths, ...links];
        console.log(paths_and_links)
        let group_id = await eel.generate_group_id()();

        for (let i = 0; i < paths_and_links.length; i++){

            let list = []
            list.push(paths_and_links[i])
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
        dolgota.value = ""
        shirota.value = ""
        place.value = ""
        datapicker.value = ""
        camera.value = ""
        fileDialogValue = ""
        document.getElementById("fileValue").innerHTML = "Файлы: пусто"
    }
}

function CreateImg(){
    let linkInput = document.getElementById("inputLink")
    const container_link = document.getElementById("container_link")
    let existingImg = container_link.nextElementSibling

    if(existingImg && existingImg.tagName === "IMG"){
        existingImg.remove()
    }

    if(linkInput.value){
        let img = document.createElement("img")
        img.src = linkInput.value
        img.alt = "Изображение не найдено"
        img.id = "linkImg"
        img.classList.add("uploaded-image")
        container_link.insertAdjacentElement("afterend", img)
    }
}

function AddLink(){
    let linkInput = document.getElementById("inputLink")

    let containerLabelLink = document.createElement("div")
    containerLabelLink.classList.add("container_label_link")


    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.innerHTML = '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/>';
    svg.onclick = function() {
        containerLabelLink.remove();
    };


    if (linkInput.value){
        let labelLink = document.createElement("div")
        labelLink.innerHTML = linkInput.value
        labelLink.classList.add("label_link")

        let linkImg = document.getElementById('linkImg')
        linkImg.insertAdjacentElement("afterend", labelLink)

        containerLabelLink.dataset.path = linkInput.value
        containerLabelLink.appendChild(svg)
        containerLabelLink.appendChild(labelLink)

        linkImg.insertAdjacentElement("afterend", containerLabelLink)

        linkInput.value = ""
        CreateImg()
    }
}



// Перемещение маркера карты при
// измении поля ввода координат
var placeMark
var myMap
var mapSearch

function editInput(){
    var shirotaValue = document.getElementById('shirota').value
    var dolgotaValue = document.getElementById('dolgota').value

    placeMark.geometry.setCoordinates([shirotaValue, dolgotaValue]);
}


// Яндекс карта
function init(){
    // Создание карты.
    myMap = new ymaps.Map("map", {
        center: [43., 131.90],
        controls: ['zoomControl'],
        suppressMapOpenBlock: true,
        zoom: 8
    });

    mapSearch = new ymaps.Map("map_search", {
        center: [57., 80.90],
        controls: ['zoomControl'],
        suppressMapOpenBlock: true,
        zoom: 3
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
    let squad_value = document.getElementById("inputSquad").value

    if (squad_value){
        let response  = await eel.add_squad(squad_value)()
        console.log(response)
        if (response == true){
            document.getElementById("inputSquad").value = ""
            ClearClassTable()
            CreateClassTable()
            CreateSquadBox()
        }
        else{
            Alert(response)
        }
    }
    else{
        Alert("Введите название отряда")
    }
}


async function CreateFamily(){
    let family_value = document.getElementById("inputFamily").value

    if (family_value){
        let response = await eel.add_family(family_value)()

        if (response == true){
            document.getElementById("inputFamily").value = ''
            CreateFamilyBox()
        }
        else{
            Alert(response)
        }
    }
    else{
        Alert("Введите название семейства")
    }
}


async function CreateSquadBox(){
    let box = document.getElementById("squadBox")
    $(box).empty();
    let squads = await eel.get_all_squad()()

    for(let i = 0; i < squads.length; i++){
        let option = document.createElement("option")
        option.value = squads[i][0]
        option.text = squads[i][1]


        box.appendChild(option)
    }
}


async function CreateViewBox(){
    let box = document.getElementById("viewBox")
    $(box).empty();
    let families = await eel.get_all_family()()

    families.forEach(([id, name]) => {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = name;
        box.appendChild(option);
    });
}


async function CreateFamilyBox(){
    let box = document.getElementById("family_box")
    $(box).empty();
    let families = await eel.get_all_family()()

    families.forEach(([id, name]) => {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = name;
        box.appendChild(option);
    });
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

        let svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgIcon.setAttribute("width", "24");
        svgIcon.setAttribute("height", "24");
        svgIcon.setAttribute("viewBox", "0 0 24 24");
        svgIcon.classList.add("squad-icon");


        let squad_id = squads[i][0]
        // Создаем path для SVG
        let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "currentColor");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");
        path.setAttribute("stroke-width", "2");
        path.setAttribute("d", "M18 6L6 18M6 6l12 12");
        svgIcon.onclick = async function(){
            if (await AlertConfirm("Вы хотите удалить ?")){
                eel.delete_squad_by_id(squad_id)
                ClearClassTable()
                CreateClassTable()
            }
        }

        // Добавляем path в SVG
        svgIcon.appendChild(path);
        squadTitle.appendChild(svgIcon);



        let familys = await eel.get_all_family_by_id(squad_id)()
        // console.log(familys)

        let squadFamily = document.createElement("div")
        squadFamily.classList.add("squad-family")

        squadConteiner.appendChild(squadTitle)

        for (let j = 0; j < familys.length; j++){
            // let a = document.createElement("a")
            // a.href = `#f${familys[j][0]}`
            // a.innerHTML = familys[j][1]
            let familys_id = familys[j][0]

            let svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgIcon.setAttribute("width", "24");
            svgIcon.setAttribute("height", "24");
            svgIcon.setAttribute("viewBox", "0 0 24 24");
            svgIcon.classList.add("squad-icon");


            // let squad_id = squads[i][0]
            // Создаем path для SVG
            let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", "currentColor");
            path.setAttribute("stroke-linecap", "round");
            path.setAttribute("stroke-linejoin", "round");
            path.setAttribute("stroke-width", "2");
            path.setAttribute("d", "M18 6L6 18M6 6l12 12");
            svgIcon.onclick = async function(e){
                e.stopPropagation()

                if (await AlertConfirm("Вы хотите удалить ?")){
                    eel.delete_family_by_id(familys_id)
                    ClearClassTable()
                    CreateClassTable()
                }
            }

            // Добавляем path в SVG
            svgIcon.appendChild(path);




            let familyTitle = document.createElement("div")
            familyTitle.classList.add("family-title")
            // familyTitle.appendChild(a)
            familyTitle.onclick = function(){
                CreateConteiner2()
            }
            familyTitle.innerHTML = familys[j][1]

            familyTitle.appendChild(svgIcon);

            squadFamily.appendChild(familyTitle)
            squadConteiner.appendChild(squadFamily)


            let familyId = familys[j][0]

            let views = await eel.get_view_in_family(familyId)()
            for (let k = 0; k < views.length; k++){
                let name = views[k][0]


                let familyVid = document.createElement("div")
                familyVid.classList.add("squad-family-vid")

                let vidTitle = document.createElement('div')
                vidTitle.classList.add("vid-title")
                // vidTitle.style.fontSize = "16px"
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


async function CreateConteiner2(){
    let conteinerDiv = document.querySelector("div.conteiner");
    conteinerDiv.style.display = "none"

    let conteiner2 = document.getElementById("conteiner-2")
    conteiner2.style.display = "flex"
    $(conteiner2).empty()

    let squads = await eel.get_all_squad()()
    for(let i = 0; i < squads.length; i++){
        let squadName = document.createElement("div")
        squadName.classList.add("squadName")
        squadName.innerHTML = squads[i][1]


        let squadCont = document.createElement("div")
        squadCont.classList.add("squad-conteiner")
        squadCont.appendChild(squadName)


        let squad_id = squads[i][0]
        let familys = await eel.get_all_family_by_id(squad_id)()
        for(let j = 0; j < familys.length; j++){
            let familyName = document.createElement("div")
            familyName.classList.add("familyName")
            // familyName.id = "f" + familys[j][0]
            familyName.innerHTML = familys[j][1]



            let vidList = document.createElement("div")
            vidList.classList.add("vidList")

            let family_id = familys[j][0]
            let views = await eel.get_view_in_family(family_id)()
            console.log(views)
            for(let k = 0; k < views.length; k++){
                let vidName = document.createElement("div")
                vidName.innerHTML = views[k][0]
                vidName.onclick = function(){
                    OpenPageAbout(views[k][0])
                }
                vidName.classList.add("vidName")
                vidName.classList.add("text18")


                vidList.append(vidName)
            }
            let conteinerVid = document.createElement("div")
            conteinerVid.classList.add("conteiner-vid")
            conteinerVid.append(vidList)


            let familyCont = document.createElement("div")
            familyCont.classList.add("family-conteiner")
            familyCont.appendChild(familyName)
            familyCont.appendChild(conteinerVid)
            squadCont.appendChild(familyCont)
        }

        conteiner2.appendChild(squadCont)
    }
}

function AddViewToFamily(){
    let title = Title
    let viewName = document.getElementById('viewBox').value
    eel.add_view_to_family(title, viewName)
    ClearClassTable()
    CreateClassTable()
    // CreateConteiner2()
}


async function SelectDate(){
    let start_date = document.getElementById('start_date').value
    let end_date = document.getElementById('end_date').value

    if (end_date){
        kinds = await eel.get_photo_kind_by_date(start_date, end_date)()
        console.log(kinds)
        CreateGridKind(kinds)
    }
}

async function CreateGridKind(kinds){
    let container_grid_label = document.getElementById('container_grid_label')
    $(container_grid_label).empty()

    for (let i = 0; i < kinds.length; i++){
        const check_label = document.createElement('div')
        check_label.className = "check_label"

        const check_kind = document.createElement('input')
        check_kind.type = 'checkbox'
        check_kind.value = kinds[i]
        check_kind.checked = true

        check_label.appendChild(check_kind)
        check_label.appendChild(document.createTextNode(kinds[i]))
        container_grid_label.appendChild(check_label)
    }

    
        const startDate = document.getElementById('start_date').value;
        const endDate = document.getElementById('end_date').value;

        let photos = await eel.get_kinds_by_kinds_and_date(kinds, startDate, endDate)()
        console.log(photos)
        AddMarkersToMapSearch(photos)
}

document.getElementById('container_grid_label').addEventListener('change', async function(e) {
    const checkedValues = Array.from(
        this.querySelectorAll('input[type="checkbox"]:checked')
    ).map(cb => cb.value);

        const startDate = document.getElementById('start_date').value;
        const endDate = document.getElementById('end_date').value;

        let photos  = await eel.get_kinds_by_kinds_and_date(checkedValues, startDate, endDate)()
        console.log(photos)
        AddMarkersToMapSearch(photos)
});


function AddMarkersToMapSearch(photos){
    mapSearch.geoObjects.removeAll();

    const myGeoObjects = []
    photos.forEach(item => {
        const [id, imagePath, kind, date, city, lat, lon, camera, group_id, note, favorite] = item

        const coords = [parseFloat(lat), parseFloat(lon)]

        const placemark = new ymaps.Placemark(coords, {
            balloonContent: `
            <div class="kek" onclick="
                eel.save_value('${kind}');
                eel.save_id('${id}');
                GoPhotoPage();
                "style="cursor: pointer;">
            ${kind} <br>
            ${city}, ${date}
            <img src="${imagePath}"">
            </div>
            `,
            clusterCaption: `${kind}`
        })

        myGeoObjects.push(placemark);
    })

    const myClusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true
    });

    myClusterer.add(myGeoObjects);
    mapSearch.geoObjects.add(myClusterer);
}

function AddFamilyToSquad(){
    let squad_id = document.getElementById('squadBox').value
    let family_id = document.getElementById('family_box').value
    eel.add_family_to_squad(squad_id, family_id)
    ClearClassTable()
    CreateClassTable()
}


CreateClassTable()