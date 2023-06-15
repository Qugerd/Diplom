let fileDialogValue;
let ID;

function CreateTableRow(id, path_sound, date, country, place, type, duration){

    //Создание новых строк в таблице
    let tr = document.createElement("tr")
    tr.classList.add(`row-${id}`)

    let tdAudio = document.createElement("td")
    let audio = document.createElement("audio")
    audio.setAttribute("src", 'http://localhost:8000/' + path_sound)
    audio.setAttribute("controls", "")
    audio.controlsList = "nodownload noplaybackrate "
    tdAudio.appendChild(audio)
    tr.appendChild(tdAudio)

    let tdDuration = document.createElement("td")
    tdDuration.innerHTML = duration
    tr.appendChild(tdDuration)


    let tdDate = document.createElement("td")
    tdDate.innerHTML = date
    tr.appendChild(tdDate)


    let tdCountry = document.createElement("td")
    tdCountry.innerHTML = country
    tr.appendChild(tdCountry)


    let tdPlace = document.createElement("td")
    tdPlace.innerHTML = place
    tr.appendChild(tdPlace)


    let tdType = document.createElement("td")
    tdType.innerHTML = type
    tr.appendChild(tdType)


    let tdButtons = document.createElement("td")
    let btnEdit = document.createElement("button")
    btnEdit.classList.add("edit")
    btnEdit.addEventListener("click", function(){
        EditeSound(id, date, country, place, type)
    })

    let btnFolder = document.createElement("button")
    btnFolder.classList.add("sif")
    btnFolder.addEventListener("click", function(){
        ShowSound(path_sound)
    })

    let btnDelete = document.createElement("button")
    btnDelete.classList.add("del")
    btnDelete.addEventListener("click", function(){
        DeleteSound(id)
    })

    tdButtons.appendChild(btnEdit)
    tdButtons.appendChild(btnFolder)
    tdButtons.appendChild(btnDelete)
    tr.appendChild(tdButtons)

    let tableBody = document.getElementById("table-body")
    tableBody.appendChild(tr)
}


eel.get_sounds_by_view()(function(data){
    for(let i = 0; i < data.length; i++){
        let id = data[i][0]
        let path_sound = data[i][1]
        let view = data[i][2]
        let date = data[i][3]
        let country = data[i][4]
        let place = data[i][5]
        let type = data[i][6]
        let duration = data[i][7]


        CreateTableRow(id, path_sound, date, country, place, type, duration)
    }
})


async function Confirm(){
    let date = document.getElementById("input-date")
    let country = document.getElementById("input-country")
    let place = document.getElementById("input-place")
    let type = document.getElementById("input-type")

    filePath = fileDialogValue

    if(filePath == null || filePath == ''){
        alert("Выберите файл")
    }
    else if(date.value == ''){
        alert("Выберите дату")
    }
    else if (country.value == ''){
        alert("Введите страну")
    }
    else if (place.value == ''){
        alert("Введите локацию")
    }
    else if (type.value == ''){
        alert("Введите тип")
    }
    else{
        let response = await eel.add_sound(filePath, date.value, country.value, place.value, type.value)()

        alert(response)
    
        date.value = ''
        country.value = ''
        place.value = ''
        type.value = ''
        filePath, fileDialogValue = ''

        location.reload()
    }
}

function ConfirmEdite(){
    let date = document.getElementById("edite-date")
    let country = document.getElementById("edite-country")
    let place = document.getElementById("edite-place")
    let type = document.getElementById("edite-type")

    eel.edite_sound(ID, date.value , country.value , place.value , type.value )

    let classname = ".row-" + ID
    let row = document.querySelector(classname)
    row.cells[2].textContent = date.value
    row.cells[3].textContent = country.value
    row.cells[4].textContent = place.value
    row.cells[5].textContent = type.value

    document.getElementById("modalEdite").classList.remove("open")
}

async function OpenFileDialog(){
    fileDialogValue = await eel.OpenFileDialogSound()()
}


function OpenModal(){
    let modal = document.getElementById("modal")
    modal.classList.add("open")
}


function CloseModal(){
    let modal = document.getElementById("modal")
    modal.classList.remove("open")
}

function DeleteSound(id){
    eel.delete_sound(id)
    let classname = ".row-" + id
    document.querySelector(classname).remove()
}

function ShowSound(path_sound){
    eel.open_folder(path_sound)
}

function EditeSound(id, date, country, place, type){
    ID = id

    document.getElementById("modalEdite").classList.add("open")

    document.getElementById("edite-date").value = date

    document.getElementById("edite-country").value = country

    document.getElementById("edite-place").value = place

    document.getElementById("edite-type").value = type
    
}

function CloseModalEdite(){
    document.getElementById("modalEdite").classList.remove("open")
}