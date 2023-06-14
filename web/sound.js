let fileDialogValue


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


        //Создание новых строк в таблице
        let tr = document.createElement("tr")

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
            EditeSound()
        })
        let btnFolder = document.createElement("button")
        btnFolder.classList.add("sif")
        btnFolder.addEventListener("click", function(){
            ShowSound()
        })
        let btnDelete = document.createElement("button")
        btnDelete.classList.add("del")
        btnDelete.addEventListener("click", function(){
            DeleteSound()
        })
        tdButtons.appendChild(btnEdit)
        tdButtons.appendChild(btnFolder)
        tdButtons.appendChild(btnDelete)
        tr.appendChild(tdButtons)

        let tableBody = document.getElementById("table-body")
        tableBody.appendChild(tr)
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
    }
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

function DeleteSound(){
    alert("Sound Deleted")
}

function ShowSound(){
    alert("Show")
}

function EditeSound(){
    alert("Edited")
}