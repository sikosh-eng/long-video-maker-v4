// ============================================
// LONG VIDEO MAKER V4
// MAIN APP
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

const progress = document.getElementById("progress");
const progressBar = document.getElementById("progressBar");


// ============================================
// AUDIO
// ============================================

audioInput.addEventListener("change", function () {

    if (!this.files.length) return;

    audioFile = this.files[0];

    audioName.textContent =
        "✅ " + audioFile.name;
});


// ============================================
// IMAGES
// ============================================

imageInput.addEventListener("change", function () {

    imageFiles = Array.from(this.files);

    imageCount.textContent =
        "✅ Выбрано: " + imageFiles.length;

    imageList.innerHTML = "";

    imageFiles.forEach((file, index) => {

        const item =
            document.createElement("div");

        item.className = "image-item";

        item.textContent =
            `${index + 1}. ${file.name}`;

        imageList.appendChild(item);
    });
});


// ============================================
// CREATE VIDEO
// ============================================

createButton.addEventListener(
    "click",
    async function () {

        if (!audioFile) {

            showStatus(
                "❌ Сначала добавь озвучку."
            );

            return;
        }

        if (!imageFiles.length) {

            showStatus(
                "❌ Сначала добавь картинки."
            );

            return;
        }


        createButton.disabled = true;

        progress.style.display = "block";

        setProgress(5);

        try {

            showStatus(
                "🎙️ Определяем длину озвучки..."
            );


            const duration =
                await getAudioDuration(
                    audioFile
                );


            const format =
                document.getElementById(
                    "format"
                ).value;


            const resolution =
                Number(
                    document.getElementById(
                        "resolution"
                    ).value
                );


            const fps =
                Number(
                    document.getElementById(
                        "fps"
                    ).value
                );


            setProgress(10);


            showStatus(
                "🖼️ Подготавливаем картинки..."
            );


            const timeline =
                VideoEngine.createTimeline(
                    imageFiles,
                    duration
                );


            setProgress(20);


            showStatus(
                "🎬 Создаём видео...\n\n" +
                "Не закрывай страницу."
            );


            const blob =
                await ExportEngine.createVideo({

                    images: imageFiles,

                    audioFile: audioFile,

                    duration: duration,

                    format: format,

                    resolution: resolution,

                    fps: fps,

                    onProgress: function (value) {

                        setProgress(value);

                    }

                });


            setProgress(100);


            showStatus(
                "✅ Видео готово!\n\n" +
                "Длительность: " +
                duration.toFixed(1) +
                " сек.\n" +
                "Картинок: " +
                imageFiles.length +
                "\n" +
                "Формат: " +
                format +
                "\n" +
                "FPS: " +
                fps
            );


            const filename =
                "long-video-" +
                Date.now() +
                ".webm";


            ExportEngine.download(
                blob,
                filename
            );


        } catch (error) {

            console.error(error);

            showStatus(
                "❌ Ошибка:\n" +
                error.message
            );

        }


        createButton.disabled = false;

    }
);


// ============================================
// AUDIO DURATION
// ============================================

function getAudioDuration(file) {

    return new Promise(
        (resolve, reject) => {

            const audio =
                new Audio();

            const url =
                URL.createObjectURL(file);

            audio.src = url;


            audio.onloadedmetadata =
                function () {

                    const duration =
                        audio.duration;

                    URL.revokeObjectURL(url);

                    if (
                        !duration ||
                        !isFinite(duration)
                    ) {

                        reject(
                            new Error(
                                "Некорректная длительность аудио."
                            )
                        );

                        return;
                    }

                    resolve(duration);
                };


            audio.onerror =
                function () {

                    URL.revokeObjectURL(url);

                    reject(
                        new Error(
                            "Не удалось прочитать аудио."
                        )
                    );
                };
        }
    );
}


// ============================================
// PROGRESS
// ============================================

function setProgress(value) {

    progressBar.style.width =
        Math.max(
            0,
            Math.min(100, value)
        ) + "%";
}


// ============================================
// STATUS
// ============================================

function showStatus(text) {

    status.style.display = "block";

    status.textContent = text;
}
