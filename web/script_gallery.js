eel.get_gallery_photos()(function(data){
    // Контейнер для серии фото с датой и локацией
    const categoryConteiner = document.querySelector('.category-conteiner')


    // Создание элементов 
    let titleDataLocation = document.createElement("div")
    let imgConteiner = document.createElement("div")


    // Присвоение знаечний 
    let date_prev = null
    for(let i = 0; i < data.length; i++){

        let date_current = data[i][3]

        if(date_current == date_prev){

            let img = document.createElement("img")
            img.setAttribute('src', 'http://localhost:8000/' + data[i][1])
            imgConteiner.appendChild(img)
        
            let location = data[i][2]
            let dataTime = data[i][3]
            titleDataLocation.innerText = dataTime + ' | ' + location
    
            titleDataLocation.classList.add('label-container')
            imgConteiner.classList.add('img-container')
    
            // Добавление в главный контейнер 
            categoryConteiner.appendChild(titleDataLocation)
            categoryConteiner.appendChild(imgConteiner)
        }
        else{

            // Создание элементов 
            titleDataLocation = document.createElement("div")
            imgConteiner = document.createElement("div")


            let img = document.createElement("img")
            img.setAttribute('src', 'http://localhost:8000/' + data[i][1])
            imgConteiner.appendChild(img)
    
            let location = data[i][2]
            let dataTime = data[i][3]
            titleDataLocation.innerText = dataTime + ' | ' + location

            titleDataLocation.classList.add('label-container')
            imgConteiner.classList.add('img-container')



            // Добавление в главный контейнер 
            categoryConteiner.appendChild(titleDataLocation)
            categoryConteiner.appendChild(imgConteiner)
        }
        date_prev = date_current
    }
})

