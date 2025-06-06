window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

let videoPath;


eel.set_value()(function(response){
    let name_ru = response[1]
    let name_eng = response[3]
    let name_lat = response[4]

    document.getElementById("name_ru").innerHTML = name_ru
    document.getElementById("name_lat").innerHTML = name_eng
    document.getElementById("name_eng").innerHTML = name_lat
})


eel.get_video_by_view()(function(data){
    console.log(data)

    for(let i = 0; i < data.length; i++){
        let id = data[i][0]
        let path_video = data[i][1]
        let view = data[i][2]
        let date = data[i][3]
        let place = data[i][4]
        let absolute_path = data[i][5]


        let conteinerVideo = document.getElementById('conteiner-video')


        let video = document.createElement('video')
        video.setAttribute('src', path_video)
        video.setAttribute('controls', "")
        video.controlsList = "nodownload noplaybackrate"
        video.disablePictureInPicture = true


        let btnFolder = document.createElement('button')
        btnFolder.textContent = "Показать в папке"
        btnFolder.addEventListener("click", function(){
            ShowInFolder(absolute_path)
        })
        let btnDelete = document.createElement('button')
        btnDelete.textContent = "Удалить"
        btnDelete.addEventListener("click", function(){
            Delete(id)
        })


        let divVideoInfo = document.createElement('div')
        divVideoInfo.classList.add('divVideoInfo')
        divVideoInfo.innerHTML = `<span>Дата:</span> ${date} <span>Место съемки:</span> ${place}`
       
        let container_btnConteiner = document.createElement('div')
        container_btnConteiner.appendChild(btnFolder)
        container_btnConteiner.appendChild(btnDelete)

        let btnConteiner = document.createElement('div')
        btnConteiner.classList.add("button-conteiner")
        btnConteiner.appendChild(container_btnConteiner)
        btnConteiner.appendChild(divVideoInfo)



        let videoCard = document.createElement('div')
        videoCard.classList.add("video-card")
        videoCard.appendChild(video)
        videoCard.appendChild(btnConteiner)


        conteinerVideo.appendChild(videoCard)
    }
})


function Delete(id){
    eel.delete_video(id)
    location.reload()
}

async function ShowInFolder(path_video){
    eel.open_folder(path_video)
}

async function ChooseVideoFile(){
    videoPath = await eel.OpenFileDialogVideo()()
    if(!videoPath){
        document.getElementById('file_video').innerHTML = "Файл не выбран !"
    }
    else{
        document.getElementById('file_video').innerHTML = videoPath
        let date = await eel.get_video_date(videoPath)()
        document.getElementById('input_date').value = date
    }

}

function OpenModalAddVideo(){
    document.getElementById('modal').classList.add('open')
}

function CloseModalAddVideo(){
    document.getElementById('modal').classList.remove('open')
}


async function Confirm(){
    const data = document.getElementById('input_date').value
    const place = document.getElementById('input_place').value

    if(!videoPath){
        alert("Обязательно выберете файл !")
    }
    else if (!input_date){
        alert("Введите дату !")
    }
    else if (!input_place){
        alert("Введите место !")
    }
    
    eel.add_video(videoPath, data, place)
    location.reload()
}