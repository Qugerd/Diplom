const PLACEHOLD_PATH = "http://placehold.it/150x150"

let fileDialogValue = PLACEHOLD_PATH



async function CreateCardVid(title, img_path = PLACEHOLD_PATH){
    let div = document.createElement("div");
    let divName = document.createElement("div");
    let img = document.createElement("img");
    let name = document.createTextNode(`${title}`);

    let conteinerDiv = document.querySelector("div.conteiner");


    // Создание кнопок: удалить, изменить
    let btnFunctionDelete = document.createElement("button");
    btnFunctionDelete.classList.add('btn-function-delete')
    btnFunctionDelete.onclick = function(){
        Delete()
    }


    let btnFunctionEdit = document.createElement("button");
    btnFunctionEdit.classList.add('btn-function-edit')
    btnFunctionEdit.onclick = function(){
        Edit()
    }


    let divConteinerBtnFunction = document.createElement("div");
    divConteinerBtnFunction.classList.add('conteiner-btn-function')
    divConteinerBtnFunction.appendChild(btnFunctionDelete)
    divConteinerBtnFunction.appendChild(btnFunctionEdit)


    div.classList.add('vid')
    img.onclick = function(){
        OpenPageAbout(title)
    }
    divName.classList.add('vid-name')

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


// function Submit(){
//     const value = document.querySelector("input.input").value;
//     if (document.getElementById('r1').checked) {
        
//     }
//     console.log(value);
//     eel.name(value);
//     CreateCardVid(value);
// }


function OpenModal(){
    document.getElementById("modal-uploadPhoto").classList.add("open")
}

document.getElementById("btnAddVid").addEventListener("click", function(){
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
      
        CreateCardVid(name, await eel.get_last_image()())
        
        fileDialogValue = PLACEHOLD_PATH

        document.getElementById("modal").classList.remove("open")
        document.getElementById("inputName").value = ''
    }

}


async function OpenFileDialog(){
    // eel.OpenFileDialog()(function(path){
    //     fileDialogValue = path
    //     console.log(fileDialogValue)
    // })
    fileDialogValue =  await eel.OpenFileDialog()()
    console.log(fileDialogValue)
}


eel.parse()(function(mas) {
    for (let i = 0; i < mas.length; i++) {
        let innerMas = mas[i];

        let title = innerMas[0];
        let img_path = innerMas[1];

        CreateCardVid(title, img_path)
    }
});


function OpenPageAbout(title){
    eel.save_value(title)
    window.location.replace("about.html")
}

function Edit(){
    alert('Вы хотите езменить елемент?')
}

function Delete(){
    alert('Вы хотите удалить елемент?')
}

eel.fill_combobox_values()(function(list){
    let combobox = document.getElementById('combobox')

    for(let i = 0; i < list.length; i++){
        let option = document.createElement("option")
        option.text = list[i]
        combobox.appendChild(option)
    }
})

function ConfirmUploadPhoto(){
    let combobox = document.getElementById("combobox").value
    let datapicker = document.getElementById("datapicker").value
    let place = document.getElementById("place").value
    let shirota = document.getElementById("shirota").value
    let dolgota = document.getElementById("dolgota").value
    let camera = document.getElementById("camera").value

    // console.log(combobox)
    // console.log(datapicker)
    // console.log(place)
    // console.log(shirota)
    // console.log(dolgota)
    // console.log(camera)

    let list = []
    list.push(fileDialogValue)
    list.push(combobox)
    list.push(datapicker)
    list.push(place)
    list.push(shirota)
    list.push(dolgota)
    list.push(camera)
    console.log(list)

    eel.put_data_to_db(list)
}