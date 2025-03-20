document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('imageInput');
    const brightnessInput = document.getElementById('brightness');
    const rotateButton = document.getElementById('rotateButton');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const saveButton = document.getElementById('saveButton');

    let img = new Image();
    let rotation = 0; // Текущий угол поворота
    let brightness = 100; // Текущая яркость

    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                img.onload = function() {
                    drawImage(); // Рисуем изображение с учетом яркости и поворота
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    brightnessInput.addEventListener('input', function() {
        if (img.src) {
            brightness = brightnessInput.value; // Обновляем значение яркости
            drawImage(); // Перерисовываем изображение
        }
    });

    rotateButton.addEventListener('click', function() {
        if (img.src) {
            rotation = (rotation + 90) % 360; // Увеличиваем угол поворота на 90 градусов
            drawImage(); // Перерисовываем изображение
        }
    });

    saveButton.addEventListener('click', function() {
        if (img.src) {
            const link = document.createElement('a');
            link.download = 'edited-image.png';
            link.href = canvas.toDataURL();
            link.click();
        }
    });

    function drawImage() {
        // Очищаем canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Устанавливаем размеры canvas в зависимости от угла поворота
        if (rotation % 180 === 0) {
            canvas.width = img.width;
            canvas.height = img.height;
        } else {
            canvas.width = img.height;
            canvas.height = img.width;
        }

        // Сохраняем текущее состояние canvas
        ctx.save();

        // Перемещаем начало координат в центр canvas
        ctx.translate(canvas.width / 2, canvas.height / 2);

        // Поворачиваем canvas
        ctx.rotate((rotation * Math.PI) / 180);

        // Применяем яркость
        ctx.filter = `brightness(${brightness}%)`;

        // Рисуем изображение с учетом поворота и яркости
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        // Восстанавливаем состояние canvas
        ctx.restore();
    }
});