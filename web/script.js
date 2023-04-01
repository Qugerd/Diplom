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
    let img = document.createElement("img");
    let name = document.createTextNode("название");

    let conteinerDiv = document.querySelector("div.conteiner");

    img.setAttribute('src', 'assets/duc.jpg')
    img.setAttribute('src', 'assets/duc.jpg')

    div.appendChild(img);
    div.appendChild(name);
    conteinerDiv.appendChild(div);
}