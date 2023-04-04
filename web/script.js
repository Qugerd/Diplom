async function CreateCardVid(n="Название"){
    let div = document.createElement("div");
    let divName = document.createElement("div");
    let img = document.createElement("img");
    let name = document.createTextNode(`${n}`);

    let conteinerDiv = document.querySelector("div.conteiner");

    div.classList.add('vid')
    divName.classList.add('vid-name')

    img.setAttribute('src', 'http://placehold.it/120x150')
    img.setAttribute('height', '120')
    img.setAttribute('width', '150')

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