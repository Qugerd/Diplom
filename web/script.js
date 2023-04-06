const PLACEHOLD_PATH = "http://placehold.it/150x150"





async function CreateCardVid(id, title, img_path){
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
            img.setAttribute('src', PLACEHOLD_PATH)
            img.setAttribute('height', '150')
            img.setAttribute('width', '150')
        }

        divName.appendChild(name);
        div.appendChild(img);
        div.appendChild(divName);
        conteinerDiv.appendChild(div);
}


function Submit(){
    const value = document.querySelector("input.input").value;
    if (document.getElementById('r1').checked) {
        
    }
    console.log(value);
    eel.name(value);
    CreateCardVid(value);
}


document.getElementById("btnAddVid").addEventListener("click", function(){
    document.getElementById("modal").classList.add("open")
})


document.getElementById("btnCloseModal").addEventListener("click", function(){
    document.getElementById("modal").classList.remove("open")
})


function Confirm(){
    let name = document.getElementById("inputName").value
    console.log(name)
    CreateCardVid(name)
    document.getElementById("modal").classList.remove("open")
    document.getElementById("inputName").value = ''
}


function OpenProvodnik(input){
    let file = input.files[0];
    console.log(file.name);

    let reader = new FileReader();
    reader.readAsDataURL(file)

    reader.onload = function(){
        console.log(reader.result)
    }
}


function OpenFileDialog(){
    eel.OpenFileDialog()
}


eel.parse()(function(mas) {
    console.log(mas[0])
    console.log(mas.length)


    for (let i = 0; i < mas.length; i++) {
        innerMas = mas[i];

        let id = innerMas[0];
        let title = innerMas[1];
        let img_path = innerMas[2];

        CreateCardVid(id, title, img_path)
    }
});