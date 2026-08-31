// ============================================
// LONG VIDEO MAKER V4
// AUTOMATIC PIPELINE
// ============================================

window.AutoPipeline = {

    async run({
        audio,
        images,
        format,
        resolution,
        fps,
        onProgress
    }) {

        if (!audio) {
            throw new Error("Озвучка не выбрана.");
        }

        if (!images || images.length === 0) {
            throw new Error("Картинки не выбраны.");
        }

        // ----------------------------------------
        // 1. Получаем длительность аудио
        // ----------------------------------------

        onProgress?.(5, "🎙️ Анализируем озвучку...");

        const audioInfo =
            await AudioTranscriber.getAudioInfo(audio);

        const duration =
            audioInfo.duration;


        // ----------------------------------------
        // 2. Распознаём речь
        // ----------------------------------------

        onProgress?.(
            15,
            "🤖 Распознаём речь..."
        );

        let transcription;

        try {

            transcription =
                await WhisperEngine.transcribe(
                    audio
                );

        } catch (error) {

            console.warn(
                "Whisper unavailable:",
                error
            );

            transcription = {
                text: "",
                segments: []
            };
        }


        // ----------------------------------------
        // 3. Создаём таймлайн
        // ----------------------------------------

        onProgress?.(
            55,
            "🧠 Создаём таймлайн..."
        );


        let timeline;


        if (
            transcription &&
            transcription.segments &&
            transcription.segments.length
        ) {

            timeline =
                await AIMatcher.match(
                    transcription,
                    images
                );

        } else {

            // Запасной вариант:
            // равномерное распределение

            timeline = [];

            const part =
                duration / images.length;


            images.forEach(
                (image, index) => {

                    timeline.push({

                        index: index,

                        start:
                            index * part,

                        end:
                            (index + 1) * part,

                        duration:
                            part,

                        text: "",

                        keywords: [],

                        image: image

                    });

                }
            );
        }


        // ----------------------------------------
        // 4. Проверяем таймлайн
        // ----------------------------------------

        onProgress?.(
            75,
            "🖼️ Проверяем изображения..."
        );


        timeline =
            timeline.filter(
                item => item.image
            );


        if (!timeline.length) {

            throw new Error(
                "Не удалось создать таймлайн."
            );
        }


        // ----------------------------------------
        // 5. Подготавливаем данные
        // ----------------------------------------

        onProgress?.(
            90,
            "🎬 Подготавливаем видео..."
        );


        const result = {

            audio: audio,

            duration: duration,

            format: format,

            resolution: resolution,

            fps: fps,

            transcription:
                transcription,

            timeline:
                timeline

        };


        onProgress?.(
            100,
            "✅ Автомонтаж готов!"
        );


        return result;
    }

};
