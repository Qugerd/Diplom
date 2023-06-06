eel.get_video_by_view()(function(data){
    console.log(data)

    for(let i = 0; i < data.length; i++){
        let id = data[i][0]
        let path_video = data[i][1]
        let view = data[i][2]
        let date = data[i][3]


        let conteinerVideo = document.getElementById('conteiner-video')


        let video = document.createElement('video')
        video.setAttribute('src', 'http://localhost:8000/' + path_video)
        video.setAttribute('controls', "")


        conteinerVideo.appendChild(video)
    }
})







async function AddVideo(){
    var videoPath = await eel.OpenFileDialogVideo()()
    console.log(videoPath)

    var date = "01.02.2023"
    console.log(date)

    eel.add_video(videoPath, date)

    location.reload()
}