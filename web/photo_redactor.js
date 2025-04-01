var photo_path = ''
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
var img = new Image()
let cropper;




// ПАРАМЕТРЫ ИЗОЮРАЖЕНИЯ
let scaledWidth = 0;
let scaledHeight = 0;
let rotation = 0; // Текущий угол поворота
let brightness = 100; // Текущая яркость
let contrast = 100; // Текущий контраст
let saturation = 100; // Текущий контраст
let sharpness = 0; // Текущий контраст
let hue = 0; // Текущий hue
let gray = 0; // Текущий серый


// ПАРАМЕТРЫ ДЛЯ СБРОСА ОБРЕЗКИ ФОТО
let originalImage = new Image();
let originalHeight;
let originalWidth;



let displayWidth = 0;  // Ширина для отображения
let displayHeight = 0; // Высота для отображения



document.getElementById('crop-btn').addEventListener("click", function(){
    const container_crop_btns = document.getElementById('container_crop_btns')
    container_crop_btns.style.display = "flex"

    const image = document.getElementById('canvas')

    const canvas_container = document.getElementById('canvas_container')
    canvas_container.style.height = image.height + "px"
    canvas_container.style.width = image.width + "px"

    cropper = new Cropper(image, {
        aspectRatio:0,
        viewMode: 0
    });
})


function CropImage() {
    // Создаем временный canvas для учета поворота
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    // Устанавливаем размеры с учетом поворота
    if (rotation % 180 === 90) {
        tempCanvas.width = canvas.height;
        tempCanvas.height = canvas.width;
    } else {
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
    }
    
    // Применяем текущий поворот к временному canvas
    tempCtx.save();
    tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
    tempCtx.rotate((rotation * Math.PI) / 180);
    tempCtx.drawImage(
        img,
        -img.width / 2,
        -img.height / 2,
        img.width,
        img.height
    );
    tempCtx.restore();
    
    // Получаем обрезанное изображение с учетом поворота
    var croppedImage = cropper.getCroppedCanvas().toDataURL("image/png");
    
    img = new Image();
    img.src = croppedImage;
    img.onload = function() {
        // Сбрасываем поворот после обрезки
        rotation = 0;
        
        // Обновляем размеры
        originalWidth = img.width;
        originalHeight = img.height;
        
        const maxHeight = 580;
        displayWidth = originalWidth;
        displayHeight = originalHeight;
        
        if (displayHeight > maxHeight) {
            const scale = maxHeight / displayHeight;
            displayWidth = originalWidth * scale;
            displayHeight = maxHeight;
        }
        
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        
        const canvas_container = document.getElementById('canvas_container');
        canvas_container.style.width = displayWidth + 'px';
        canvas_container.style.height = displayHeight + 'px';

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
    
        // Рассчитываем соотношение для масштабирования
        const scaleX = displayWidth / originalWidth;
        const scaleY = displayHeight / originalHeight;
        const scale = Math.min(scaleX, scaleY);
    
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        // ctx.filter = `grayscale(${gray}%) hue-rotate(${hue}deg) brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    
        // Рисуем с учетом масштаба
        ctx.drawImage(
            img, 
            -originalWidth * scale / 2, 
            -originalHeight * scale / 2, 
            originalWidth * scale, 
            originalHeight * scale
        );
    
        ctx.restore();

        cropper.destroy();
        HideCropBtns();
    };
}


function CropCancel(){
    cropper.destroy()
    HideCropBtns()
}

function HideCropBtns(){
    const container_crop_btns = document.getElementById('container_crop_btns')
    container_crop_btns.style.display = "none"
}



eel.get_photo()(async function(data){
    photo_path = data[1];
    img.src = photo_path;
    originalImage.src = img.src;

    img.onload = function(){
        const maxHeight = 580;

        // Сохраняем оригинальные размеры
        originalWidth = img.width;
        originalHeight = img.height;

        // Рассчитываем масштабированные размеры
        displayWidth = originalWidth;
        displayHeight = originalHeight;

        if (displayHeight > maxHeight) {
            const scale = maxHeight / displayHeight;
            displayWidth = originalWidth * scale;
            displayHeight = maxHeight;
        }

        // Устанавливаем размеры canvas
        canvas.width = displayWidth;
        canvas.height = displayHeight;

        // Рисуем изображение
        DrawImage();
    }
});






// ИЗМЕНЕНИЕ ПАРАМЕТРОВ
function Rotate(){
    // Сохраняем текущие размеры изображения
    const imgWidth = displayWidth;
    const imgHeight = displayHeight;
    
    // Обновляем угол поворота
    rotation = (rotation + 90) % 360;
    
    // Определяем, нужно ли менять ориентацию canvas
    const shouldSwapDimensions = rotation % 180 === 90;
    
    if (shouldSwapDimensions) {
        // Меняем размеры canvas местами
        [canvas.width, canvas.height] = [imgHeight, imgWidth];
        
        // Обновляем размеры контейнера
        const canvas_container = document.getElementById('canvas_container');
        canvas_container.style.width = `${imgHeight}px`;
        canvas_container.style.height = `${imgWidth}px`;
    } else {
        // Возвращаем оригинальные размеры
        canvas.width = imgWidth;
        canvas.height = imgHeight;
        
        const canvas_container = document.getElementById('canvas_container');
        canvas_container.style.width = `${imgWidth}px`;
        canvas_container.style.height = `${imgHeight}px`;
    }

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


function SaveImage(){
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvas.toDataURL();
    link.click();
}




// СБРОС НАСТРОЕК
function ResetCrop(){
    // Создаем новое изображение из оригинального источника
    const restoredImg = new Image();
    restoredImg.src = originalImage.src;
    
    restoredImg.onload = function() {
        // Восстанавливаем оригинальные размеры
        originalWidth = restoredImg.width;
        originalHeight = restoredImg.height;
        
        // Пересчитываем масштабированные размеры для отображения
        const maxHeight = 580;
        displayWidth = originalWidth;
        displayHeight = originalHeight;
        
        if (displayHeight > maxHeight) {
            const scale = maxHeight / displayHeight;
            displayWidth = originalWidth * scale;
            displayHeight = maxHeight;
        }
        
        // Обновляем текущее изображение
        img = restoredImg;
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        
        // Обновляем контейнер
        const canvas_container = document.getElementById('canvas_container');
        canvas_container.style.height = displayHeight + "px";
        canvas_container.style.width = displayWidth + "px";
        
        // Перерисовываем
        DrawImage();
    };
}


function ResetRotate(){
    rotation = 0
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    const canvas_container = document.getElementById('canvas_container');
    canvas_container.style.height = displayHeight + "px";
    canvas_container.style.width = displayWidth + "px";
    DrawImage()
}

function ResetBrightness(){
    var slider_brigthness = document.getElementById('slider_brigthness')
    slider_brigthness.value = 100
    brightness = 100
    DrawImage()
}

function ResetContrast(){
    var slider_contrast = document.getElementById('slider_contrast')
    slider_contrast.value = 100
    contrast = 100
    DrawImage()
}

function ResetSaturation(){
    var slider_saturation = document.getElementById('slider_saturate')
    slider_saturation.value = 100
    saturation = 100
    DrawImage()
}

function ResetHue(){
    var slider_hue = document.getElementById('slider_hue')
    slider_hue.value = 0
    hue = 0
    DrawImage()
}

function ResetGray(){
    var slider_gray = document.getElementById('slider_gray')
    slider_gray.value = 0
    gray = 0
    DrawImage()
}

function ResetAllChanges(){
    ResetCrop()
    ResetRotate()
    ResetBrightness()
    ResetContrast()
    ResetSaturation()
    ResetHue()
    ResetGray()
}







function DrawImage(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Рассчитываем соотношение для масштабирования
    const scaleX = displayWidth / originalWidth;
    const scaleY = displayHeight / originalHeight;
    const scale = Math.min(scaleX, scaleY);

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.filter = `grayscale(${gray}%) hue-rotate(${hue}deg) brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

    // Рисуем с учетом масштаба
    ctx.drawImage(
        img, 
        -originalWidth * scale / 2, 
        -originalHeight * scale / 2, 
        originalWidth * scale, 
        originalHeight * scale
    );

    ctx.restore();
}
