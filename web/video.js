window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});



// const video = document.getElementById('myVideo');
// video.addEventListener('play', function() {
//     this.classList.add('playing');
//     this.parentElement.classList.add('playing')
// });

// video.addEventListener('pause', function() {
//     this.classList.remove('playing');
//     this.parentElement.classList.remove('playing')
// });





eel.get_video_by_view()(function(data){
    console.log(data)

    for(let i = 0; i < data.length; i++){
        let id = data[i][0]
        let path_video = data[i][1]
        let view = data[i][2]
        let date = data[i][3]
        let absolute_path = data[i][4]


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

        let btnConteiner = document.createElement('div')
        btnConteiner.classList.add("button-conteiner")
        btnConteiner.appendChild(btnFolder)
        btnConteiner.appendChild(btnDelete)


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

function ShowInFolder(path_video){
    eel.open_folder(path_video)
}

async function AddVideo(){
    var videoPath = await eel.OpenFileDialogVideo()()
    console.log(videoPath)

    var date = "01.02.2023"
    console.log(date)

    if (videoPath != ""){
        eel.add_video(videoPath, date)
        location.reload()
    }
}