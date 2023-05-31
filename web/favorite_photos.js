eel.get_all_favorite_photos()(function(photos){
    const conteiner = document.querySelector('.conteiner-image')

    for (let i = 0 ; i < photos.length; i++){
        const image = document.createElement('img')

        const photo_id = photos[i][0]
        const photo_path = photos[i][1]
        image.setAttribute('src', 'http://localhost:8000/' + photo_path)

        conteiner.appendChild(image)
    }
})