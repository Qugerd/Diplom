window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

eel.get_all_favorite_photos()(function(photos){
    const conteiner = document.querySelector('.conteiner-image')

    for (let i = 0 ; i < photos.length; i++){
        const image = document.createElement('img')

        const photo_id = photos[i][0]
        const photo_path = photos[i][1]
        image.setAttribute('src', photo_path)
        image.addEventListener("click", function(){
            eel.save_id(photo_id)
            GoPhotoPage()
        })

        conteiner.appendChild(image)
    }
})

eel.set_value()(function(response){
    let name_ru = response[1]
    let name_eng = response[3]
    let name_lat = response[4]

    document.getElementById("name_ru").innerHTML = name_ru
    document.getElementById("name_lat").innerHTML = name_eng
    document.getElementById("name_eng").innerHTML = name_lat
})