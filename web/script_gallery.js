eel.get_gallery_photos()(function(data){
    // console.log(data)
    // console.log(data[0][0])


    // Контейнер для серии фото с датой и локацией
    const categoryConteiner = document.querySelector('.category-conteiner')

    // Создание элементов 
    let titleDataLocation = document.createElement("div")
    let imgConteiner = document.createElement("div")


    // Присвоение знаечний 
    for(let i = 0; i < data.length; i++){
        console.log(data[i][0])

        let img = document.createElement("img")
        img.setAttribute('src', 'http://localhost:8000/' + data[i][1])
        imgConteiner.appendChild(img)
    }

    titleDataLocation.innerText = '01-01-2023 | Приморский край'
    titleDataLocation.classList.add('label-container')
    imgConteiner.classList.add('img-container')



    // Добавление в главный контейнер 
    categoryConteiner.appendChild(titleDataLocation)
    categoryConteiner.appendChild(imgConteiner)
})

