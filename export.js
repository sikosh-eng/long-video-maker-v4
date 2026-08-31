// ============================================
// LONG VIDEO MAKER V4
// VIDEO EXPORT ENGINE
// ============================================

window.ExportEngine = {

    async createVideo(options) {

        const {
            images,
            audioFile,
            duration,
            format,
            resolution,
            fps,
            onProgress
        } = options;

        if (!images.length) {
            throw new Error("Нет изображений.");
        }

        if (!audioFile) {
            throw new Error("Нет аудиофайла.");
        }

        const canvas =
            VideoEngine.createCanvas(
                format,
                resolution
            );

        const ctx =
            canvas.getContext("2d");

        const stream =
            canvas.captureStream(fps);

        // Добавляем аудио
        const audio =
            document.createElement("audio");

        const audioUrl =
            URL.createObjectURL(audioFile);

        audio.src = audioUrl;
        audio.volume = 1;

        const audioContext =
            new AudioContext();

        const source =
            audioContext.createMediaElementSource(
                audio
            );

        const destination =
            audioContext.createMediaStreamDestination();

        source.connect(destination);
        source.connect(audioContext.destination);

        destination.stream
            .getAudioTracks()
            .forEach(track => {
                stream.addTrack(track);
            });


        const recorder =
            new MediaRecorder(
                stream,
                {
                    mimeType:
                        "video/webm;codecs=vp9,opus"
                }
            );


        const chunks = [];

        recorder.ondataavailable =
            event => {

                if (event.data.size > 0) {
                    chunks.push(event.data);
                }

            };


        const imageObjects = [];

        for (
            let i = 0;
            i < images.length;
            i++
        ) {

            const image =
                await VideoEngine.loadImage(
                    images[i]
                );

            imageObjects.push(image);

            if (onProgress) {

                onProgress(
                    5 +
                    Math.round(
                        (i / images.length) * 15
                    )
                );

            }

        }


        recorder.start();

        await audioContext.resume();

        audio.currentTime = 0;

        await audio.play();


        const startTime =
            performance.now();


        let currentIndex = -1;


        function drawFrame() {

            const elapsed =
                (performance.now() -
                    startTime) / 1000;


            if (
                elapsed >= duration ||
                audio.ended
            ) {

                return;

            }


            const index =
                Math.min(
                    imageObjects.length - 1,
                    Math.floor(
                        elapsed /
                        (
                            duration /
                            imageObjects.length
                        )
                    )
                );


            if (index !== currentIndex) {

                currentIndex = index;

            }


            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );


            VideoEngine.drawCover(
                canvas,
                imageObjects[currentIndex]
            );


            if (onProgress) {

                onProgress(
                    20 +
                    Math.min(
                        75,
                        Math.round(
                            (elapsed /
                                duration) *
                            75
                        )
                    )
                );

            }


            requestAnimationFrame(
                drawFrame
            );

        }


        drawFrame();


        await new Promise(resolve => {

            const check =
                setInterval(() => {

                    if (
                        audio.ended ||
                        audio.currentTime >=
                        duration
                    ) {

                        clearInterval(check);

                        resolve();

                    }

                }, 100);

        });


        recorder.stop();

        await new Promise(resolve => {

            recorder.onstop =
                resolve;

        });


        audio.pause();

        audio.src = "";

        URL.revokeObjectURL(
            audioUrl
        );

        audioContext.close();


        const blob =
            new Blob(
                chunks,
                {
                    type:
                        "video/webm"
                }
            );


        if (onProgress) {
            onProgress(100);
        }


        return blob;
    },


    download(blob, filename) {

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            filename;

        document.body.appendChild(
            link
        );

        link.click();

        link.remove();

        setTimeout(() => {

            URL.revokeObjectURL(
                url
            );

        }, 1000);

    }

};
