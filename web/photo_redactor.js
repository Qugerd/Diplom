var photo_path = ''
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
var img = new Image()


let rotation = 0; // Текущий угол поворота
let brightness = 100; // Текущая яркость
let contrast = 100; // Текущий контраст
let saturation = 100; // Текущий контраст
let sharpness = 0; // Текущий контраст
let hue = 0; // Текущий hue
let gray = 0; // Текущий hue



// document.getElementById('crop-btn').addEventListener("click", function(){
//     const image = document.getElementById('image')
//     const cropper = new Cropper(image, {
//         aspectRatio:0,
//     });
// })

eel.get_photo()(async function(data){
    console.log(data)

    photo_path = data[1]
    img.src = photo_path




    img.onload = function(){

        console.log(img.width)
        console.log(img.height)

        canvas.width = img.width
        canvas.height = img.height

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }

})




function Rotate(){
    rotation = (rotation + 90) % 360
    DrawImage()
}

function ChangeBrithness(){
    inputBrigthness = document.getElementById('slider_brigthness')
    brightness = inputBrigthness.value
    DrawImage()
}

function ChangeContrast(){
    inputContrast = document.getElementById('slider_contrast')
    contrast = inputContrast.value
    DrawImage()
}

function ChangeSaturation(){
    inputSaturate = document.getElementById('slider_saturate')
    saturation = inputSaturate.value
    DrawImage()
}

function ChangeSharpness(){
    inputSharpness = document.getElementById('slider_sharpness')
    sharpness = inputSharpness.value
    sharpness = Math.max(0, 10 - sharpness / 10);
    DrawImage()
}

function ChangeHue(){
    inputHue = document.getElementById('slider_hue')
    hue = inputHue.value
    DrawImage()
}

function ChangeGray(){
    inputGray = document.getElementById('slider_gray')
    gray = inputGray.value
    DrawImage()
}



function ResetBrightness(){
    var slider_brigthness = document.getElementById('slider_brigthness')
    slider_brigthness.value = 100
    brightness = 100
    DrawImage()
}








function DrawImage(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Сохраняем текущее состояние контекста
    ctx.save();

    // Перемещаем начало координат в центр canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // Поворачиваем canvas
    ctx.rotate((rotation * Math.PI) / 180);

    // фильтр
    ctx.filter = `grayscale(${gray}%) hue-rotate(${hue}deg) brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%`;


    // Рисуем изображение с учетом поворота
    ctx.drawImage(img, -img.width / 2, -img.height / 2);

    // Восстанавливаем состояние контекста
    ctx.restore();
}

// async function Get_photo_path(){

//     const photo_path = await eel.get_photo_path()()

//     const image = document.getElementById("image")
//     image.setAttribute('src', photo_path)
//     image.setAttribute('width', '1200')
//     image.setAttribute('height', '705')

//     alert(photo_path)
// }
