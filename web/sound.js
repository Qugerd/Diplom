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


        //Создание новых строк в таблице
        let tr = document.createElement("tr")

        let tdAudio = document.createElement("td")
        let audio = document.createElement("audio")
        audio.setAttribute("src", 'http://localhost:8000/' + path_sound)
        audio.setAttribute("controls", "")
        tdAudio.appendChild(audio)
        tr.appendChild(tdAudio)

        let tdDuration = document.createElement("td")
        tdDuration.innerHTML = "10:00"
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


        let tableBody = document.getElementById("table-body")
        tableBody.appendChild(tr)
    }
})


function Confirm(){
    let date = document.getElementById("input-date").value
    let country = document.getElementById("input-country").value
    let place = document.getElementById("input-place").value
    let type = document.getElementById("input-type").value

    filePath = fileDialogValue

    eel.add_sound(filePath, date, country, place, type)
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