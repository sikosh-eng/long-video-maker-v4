// ============================================
// LONG VIDEO MAKER V4
// VIDEO ENGINE
// ============================================

const VideoEngine = {

    // Получаем размеры кадра
    getDimensions(format, resolution) {

        const height = Number(resolution);

        if (format === "9:16") {
            return {
                width: Math.round(height * 9 / 16),
                height: height
            };
        }

        if (format === "16:9") {
            return {
                width: height,
                height: Math.round(height * 9 / 16)
            };
        }

        return {
            width: height,
            height: height
        };
    },


    // Создаём данные таймлайна
    createTimeline(images, audioDuration) {

        if (!images.length) {
            throw new Error(
                "Нет изображений."
            );
        }

        if (!audioDuration || audioDuration <= 0) {
            throw new Error(
                "Некорректная длительность аудио."
            );
        }


        const timeline = [];

        const duration =
            audioDuration / images.length;


        images.forEach((image, index) => {

            timeline.push({

                id: index,

                image: image,

                start:
                    index * duration,

                end:
                    (index + 1) * duration,

                duration:
                    duration

            });

        });


        return timeline;
    },


    // Создаём canvas
    createCanvas(format, resolution) {

        const dimensions =
            this.getDimensions(
                format,
                resolution
            );


        const canvas =
            document.createElement("canvas");


        canvas.width =
            dimensions.width;

        canvas.height =
            dimensions.height;


        return canvas;
    },


    // Подготавливаем изображение
    loadImage(file) {

        return new Promise(
            (resolve, reject) => {

                const image =
                    new Image();

                const url =
                    URL.createObjectURL(file);


                image.onload =
                    function () {

                        URL.revokeObjectURL(
                            url
                        );

                        resolve(image);

                    };


                image.onerror =
                    function () {

                        URL.revokeObjectURL(
                            url
                        );

                        reject(
                            new Error(
                                "Не удалось загрузить изображение."
                            )
                        );

                    };


                image.src = url;

            }
        );
    },


    // Рисуем изображение
    drawCover(
        canvas,
        image
    ) {

        const ctx =
            canvas.getContext("2d");


        const canvasRatio =
            canvas.width /
            canvas.height;


        const imageRatio =
            image.width /
            image.height;


        let width;
        let height;
        let x;
        let y;


        if (imageRatio > canvasRatio) {

            height =
                canvas.height;

            width =
                height * imageRatio;

            x =
                (canvas.width - width) / 2;

            y = 0;

        } else {

            width =
                canvas.width;

            height =
                width / imageRatio;

            x = 0;

            y =
                (canvas.height - height) / 2;

        }


        ctx.drawImage(
            image,
            x,
            y,
            width,
            height
        );
    },


    // Начинаем поток Canvas
    startCanvasStream(
        canvas,
        fps
    ) {

        if (!canvas.captureStream) {

            throw new Error(
                "Ваш браузер не поддерживает Canvas Video."
            );

        }


        return canvas.captureStream(
            fps
        );
    }

};


// Экспортируем движок

window.VideoEngine =
    VideoEngine;
