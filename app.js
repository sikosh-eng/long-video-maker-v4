// ============================================
// LONG VIDEO MAKER V4
// Автоматическая подготовка монтажа
// ============================================

let audioFile = null;
let imageFiles = [];

const audioInput = document.getElementById("audioInput");
const imageInput = document.getElementById("imageInput");

const audioName = document.getElementById("audioName");
const imageCount = document.getElementById("imageCount");
const imageList = document.getElementById("imageList");

const createButton = document.getElementById("createButton");
const status = document.getElementById("status");


// ============================================
// ОЗВУЧКА
// ============================================

audioInput.addEventListener("change", function () {

    if (!this.files.length) return;

    audioFile = this.files[0];

    audioName.textContent =
        "🎙️ " + audioFile.name;

});


// ============================================
// КАРТИНКИ
// ============================================

imageInput.addEventListener("change", function () {

    imageFiles = Array.from(this.files);

    imageCount.textContent =
        "🖼️ Выбрано: " + imageFiles.length;

    imageList.innerHTML = "";

    imageFiles.forEach((file, index) => {

        const item = document.createElement("div");

        item.className = "image-item";

        item.innerHTML =
            `<b>${index + 1}.</b> ${file.name}`;

        imageList.appendChild(item);

    });

});


// ============================================
// СОЗДАНИЕ МОНТАЖА
// ============================================

createButton.addEventListener("click", async function () {

    if (!audioFile) {

        showStatus(
            "❌ Добавь озвучку."
        );

        return;
    }

    if (!imageFiles.length) {

        showStatus(
            "❌ Добавь хотя бы одну картинку."
        );

        return;
    }

    createButton.disabled = true;

    showStatus(
        "⏳ Подготавливаем автоматический монтаж..."
    );


    try {

        // Получаем длительность аудио
        const duration = await getAudioDuration(audioFile);

        // Получаем настройки
        const format =
            document.getElementById("format").value;

        const resolution =
            document.getElementById("resolution").value;

        const fps =
            Number(document.getElementById("fps").value);


        // Распределяем изображения
        const timeline =
            createTimeline(
                duration,
                imageFiles
            );


        // Показываем результат
        showTimeline(
            duration,
            timeline,
            format,
            resolution,
            fps
        );

    } catch (error) {

        console.error(error);

        showStatus(
            "❌ Произошла ошибка.\n" +
            error.message
        );

    }

    createButton.disabled = false;

});


// ============================================
// ПОЛУЧЕНИЕ ДЛИТЕЛЬНОСТИ AUDIO
// ============================================

function getAudioDuration(file) {

    return new Promise((resolve, reject) => {

        const audio = new Audio();

        const url =
            URL.createObjectURL(file);

        audio.src = url;

        audio.addEventListener(
            "loadedmetadata",
            function () {

                const duration =
                    audio.duration;

                URL.revokeObjectURL(url);

                resolve(duration);

            }
        );

        audio.addEventListener(
            "error",
            function () {

                URL.revokeObjectURL(url);

                reject(
                    new Error(
                        "Не удалось прочитать аудио."
                    )
                );

            }
        );

    });

}


// ============================================
// СОЗДАНИЕ TIMELINE
// ============================================

function createTimeline(
    audioDuration,
    images
) {

    const result = [];

    const imageDuration =
        audioDuration / images.length;


    images.forEach((image, index) => {

        const start =
            index * imageDuration;

        const end =
            (index + 1) * imageDuration;


        result.push({

            index: index,

            file: image,

            name: image.name,

            start: start,

            end: end,

            duration: imageDuration

        });

    });


    return result;

}


// ============================================
// ПОКАЗ TIMELINE
// ============================================

function showTimeline(
    audioDuration,
    timeline,
    format,
    resolution,
    fps
) {

    let text =
        "✅ Монтаж подготовлен!\n\n";

    text +=
        "🎙️ Озвучка: " +
        audioDuration.toFixed(2) +
        " сек.\n\n";

    text +=
        "🖼️ Картинок: " +
        timeline.length +
        "\n\n";

    text +=
        "📐 Формат: " +
        format +
        "\n";

    text +=
        "🎥 Разрешение: " +
        resolution +
        "p\n";

    text +=
        "🎞️ FPS: " +
        fps +
        "\n\n";

    text +=
        "──────────────\n\n";


    timeline.forEach((item) => {

        text +=
            `${item.index + 1}. ${item.name}\n`;

        text +=
            `${item.start.toFixed(1)}с → ` +
            `${item.end.toFixed(1)}с\n\n`;

    });


    showStatus(text);

}


// ============================================
// STATUS
// ============================================

function showStatus(text) {

    status.style.display = "block";

    status.style.whiteSpace = "pre-line";

    status.textContent = text;

}
