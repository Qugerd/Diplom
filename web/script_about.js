let ID;
let description;
let spreading;
let biology;

window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

eel.set_value()(function(response){
    ID = response[0]
    description = response[5]
    spreading = response[6]
    biology = response[7]


    const name_ru = response[1]
    const name_lat = response[3]
    const name_eng = response[4]
    const image_path = response[2]


    document.getElementById("name_ru").innerHTML = name_ru
    document.getElementById("name_lat").innerHTML = name_lat
    document.getElementById("name_eng").innerHTML = name_eng
    document.getElementById("input_name_ru").value = name_ru
    document.getElementById("input_name_lat").value = name_lat
    document.getElementById("input_name_eng").value = name_eng
    document.getElementById("descriptionText").innerHTML = description
    document.getElementById("spreadingText").innerHTML = spreading
    document.getElementById("biologyText").innerHTML = biology
    document.getElementById("image").setAttribute('src', `data:image/jpeg;base64,${image_path}`)
})




function Edit(elementId){
    let groupConteiner = document.getElementById(elementId)

    let textarea = document.createElement('textarea')
    textarea.classList.add('text')
    let textareaId = 'textarea-' + elementId
    textarea.setAttribute('id', textareaId)


    let btnConfirm = document.createElement('button')
    let btnConfirmId = 'btnConfirm-' + elementId
    btnConfirm.setAttribute('id', btnConfirmId)
    btnConfirm.textContent = "Confirm"
    btnConfirm.onclick = function(){
        Confirm(elementId, textareaId, btnConfirmId)
    }


    textarea.value = document.getElementById(elementId+'Text').innerHTML
    document.getElementById(elementId+'Text').innerHTML = ''


    groupConteiner.appendChild(textarea)
    groupConteiner.appendChild(btnConfirm)
}


function Confirm(elementId, textareaId, btnConfirmId){
    let text = document.getElementById(textareaId).value
    eel.edit_information(ID, elementId, text)
    document.getElementById(elementId + 'Text').innerHTML = text
    Remove(textareaId, btnConfirmId)
}


function Remove(textareaId, btnConfirmId){
    document.getElementById(textareaId).remove()
    document.getElementById(btnConfirmId).remove()
}


function ConfirmNamesEdite(){
    let name_ru = document.getElementById("input_name_ru").value
    let name_lat = document.getElementById("input_name_lat").value
    let name_eng = document.getElementById("input_name_eng").value

    eel.edite_names_view(name_ru, name_lat, name_eng)
    eel.save_value(name_ru)

    document.getElementById("name_ru").innerHTML = name_ru
    document.getElementById("name_lat").innerHTML = name_lat
    document.getElementById("name_eng").innerHTML = name_eng

    document.getElementById("modal").classList.remove("open")
}

function OpenModalEditName(){
    document.getElementById("modal").classList.add("open")
}

function CloseModal(){
    document.getElementById("modal").classList.remove("open")
}

