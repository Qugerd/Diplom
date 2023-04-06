const PLACEHOLD_PATH = "http://placehold.it/150x150"

let fileDialogValue = PLACEHOLD_PATH



async function CreateCardVid(title, img_path = PLACEHOLD_PATH){
    let div = document.createElement("div");
    let divName = document.createElement("div");
    let img = document.createElement("img");
    let name = document.createTextNode(`${title}`);

    let conteinerDiv = document.querySelector("div.conteiner");

    div.classList.add('vid')
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


document.getElementById("btnAddVid").addEventListener("click", function(){
    document.getElementById("modal").classList.add("open")
})


document.getElementById("btnCloseModal").addEventListener("click", function(){
    document.getElementById("modal").classList.remove("open")
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