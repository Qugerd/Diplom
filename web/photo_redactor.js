document.getElementById('crop-btn').addEventListener("click", function(){
    const image = document.getElementById('image')
    const cropper = new Cropper(image, {
        aspectRatio:0,
    });
})

eel.get_photo()(async function(data){
    console.log(data)

    photo_path = data[1]
    const image = document.getElementById("image")
    image.setAttribute('src', photo_path)

})


async function Rotate(){

    console.log(photo_path)
    const replace_path = 'web/'+photo_path.replace('\\', '/')
    console.log(replace_path)
    const rotated_image = await eel.rotate_right(replace_path)()
    image.setAttribute('src', rotated_image)
    photo_path = rotated_image
}



// async function Get_photo_path(){

//     const photo_path = await eel.get_photo_path()()

//     const image = document.getElementById("image")
//     image.setAttribute('src', photo_path)
//     image.setAttribute('width', '1200')
//     image.setAttribute('height', '705')

//     alert(photo_path)
// }
