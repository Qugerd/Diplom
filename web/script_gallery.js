eel.get_gallery_photos()(function(data){
    // Контейнер для серии фото с датой и локацией
    const categoryConteiner = document.querySelector('.category-conteiner')


    // Создание элементов 
    let titleDataLocation = document.createElement("div")
    let imgConteiner = document.createElement("div")


    // Присвоение знаечний 
    let group_id_prev = null
    for(let i = 0; i < data.length; i++){

        let group_id_current = data[i][4]

        if(group_id_current == group_id_prev){

            let img = document.createElement("img")
            img.setAttribute('src', 'http://localhost:8000/' + data[i][1])
            img.onclick = function(){
                eel.save_id(data[i][0])
                GoPhotoPage()
            }
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
            img.onclick = function(){
                eel.save_id(data[i][0])
                GoPhotoPage()
                
            }
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
        group_id_prev = group_id_current
    }
})


eel.set_value()(function(response){
    console.log(response)

    let name_ru = response[1]
    let name_en = response[3]
    let name_lat = response[4]

    document.getElementById("description").innerHTML = name_ru
    document.getElementById("spreading").innerHTML = name_en
    document.getElementById("biology").innerHTML = name_lat
})


