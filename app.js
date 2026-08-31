// ============================================
// LONG VIDEO MAKER V4
// MAIN CONTROLLER
// ============================================

let audioFile = null;
let imageFiles = [];

const audioInput =
    document.getElementById("audioInput");

const imageInput =
    document.getElementById("imageInput");

const audioName =
    document.getElementById("audioName");

const imageCount =
    document.getElementById("imageCount");

const imageList =
    document.getElementById("imageList");

const createButton =
    document.getElementById("createButton");

const status =
    document.getElementById("status");

const progress =
    document.getElementById("progress");

const progressBar =
    document.getElementById("progressBar");


// ============================================
// AUDIO SELECT
// ============================================

audioInput.addEventListener(
    "change",
    function () {

        if (!this.files.length) {
            return;
        }

        audioFile =
            this.files[0];

        audioName.textContent =
            "✅ " + audioFile.name;
    }
);


// ============================================
// IMAGE SELECT
// ============================================

imageInput.addEventListener(
    "change",
    function () {

        imageFiles =
            Array.from(
                this.files
            );

        imageCount.textContent =
            "✅ Выбрано: " +
            imageFiles.length;

        imageList.innerHTML = "";


        imageFiles.forEach(
            (file, index) => {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "image-item";

                item.textContent =
                    `${index + 1}. ${file.name}`;

                imageList.appendChild(
                    item
                );
            }
        );
    }
);


// ============================================
// CREATE
// ============================================

createButton.addEventListener(
    "click",
    async function () {

        if (!audioFile) {

            showStatus(
                "❌ Добавь озвучку."
            );

            return;
        }


        if (!imageFiles.length) {

            showStatus(
                "❌ Добавь картинки."
            );

            return;
        }


        createButton.disabled =
            true;

        progress.style.display =
            "block";

        setProgress(1);


        try {

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


            // ------------------------------------
            // AUTOMATIC PIPELINE
            // ------------------------------------

            const result =
                await AutoPipeline.run({

                    audio:
                        audioFile,

                    images:
                        imageFiles,

                    format:
                        format,

                    resolution:
                        resolution,

                    fps:
                        fps,

                    onProgress:
                        function (
                            value,
                            message
                        ) {

                            setProgress(
                                value
                            );

                            if (message) {

                                showStatus(
                                    message
                                );
                            }
                        }
                });


            // ------------------------------------
            // SHOW RESULT
            // ------------------------------------

            showTimeline(
                result
            );


        } catch (error) {

            console.error(
                error
            );

            showStatus(
                "❌ Ошибка:\n" +
                error.message
            );

        }


        createButton.disabled =
            false;
    }
);


// ============================================
// TIMELINE UI
// ============================================

function showTimeline(result) {

    const timeline =
        result.timeline;


    let text =
        "🎬 АВТОМОНТАЖ ГОТОВ\n\n";


    text +=
        "🎙️ Длительность: " +
        result.duration.toFixed(1) +
        " сек.\n";


    text +=
        "🖼️ Картинок: " +
        timeline.length +
        "\n";


    text +=
        "📐 Формат: " +
        result.format +
        "\n";


    text +=
        "🎥 Разрешение: " +
        result.resolution +
        "p\n";


    text +=
        "🎞️ FPS: " +
        result.fps +
        "\n\n";


    text +=
        "──────────────\n\n";


    timeline.forEach(
        (item, index) => {

            text +=
                `${index + 1}. `;


            if (item.image) {

                text +=
                    item.image.name;

            } else {

                text +=
                    "Без изображения";
            }


            text +=
                "\n";


            text +=
                `${formatTime(item.start)} → ` +
                `${formatTime(item.end)}\n`;


            if (item.text) {

                text +=
                    "🗣️ " +
                    item.text +
                    "\n";
            }


            if (
                item.keywords &&
                item.keywords.length
            ) {

                text +=
                    "🔑 " +
                    item.keywords.join(
                        ", "
                    ) +
                    "\n";
            }


            text +=
                "\n";
        }
    );


    showStatus(
        text
    );
}


// ============================================
// TIME FORMAT
// ============================================

function formatTime(seconds) {

    seconds =
        Math.max(
            0,
            Number(seconds) || 0
        );


    const minutes =
        Math.floor(
            seconds / 60
        );


    const secs =
        seconds % 60;


    return (
        String(minutes)
            .padStart(2, "0")
        +
        ":" +
        secs.toFixed(1)
            .padStart(4, "0")
    );
}


// ============================================
// PROGRESS
// ============================================

function setProgress(value) {

    progressBar.style.width =
        Math.max(
            0,
            Math.min(
                100,
                value
            )
        ) +
        "%";
}


// ============================================
// STATUS
// ============================================

function showStatus(text) {

    status.style.display =
        "block";

    status.textContent =
        text;
}
