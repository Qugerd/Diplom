let fileDialogValue

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