console.log('Calling Python...');
eel.my_python_function(1, 2)().then((r)=> {
    console.log(r);
    $("#vid-name").text(r);
});

async function show(){
    eel.retrieve()
}

function CreateCardVid(){
    let div = document.createElement("div");
    let divName = document.createElement("div");
    let img = document.createElement("img");
    let name = document.createTextNode("название");

    let conteinerDiv = document.querySelector("div.conteiner");

    div.classList.add('vid')
    divName.classList.add('vid-name')

    img.setAttribute('src', 'assets/duc.jpg')
    img.setAttribute('height', '120')
    img.setAttribute('width', '150')

    divName.appendChild(name);
    div.appendChild(img);
    div.appendChild(divName);
    conteinerDiv.appendChild(div);
}