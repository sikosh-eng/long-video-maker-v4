// ============================================
// LONG VIDEO MAKER V4
// AI IMAGE MATCHER
// ============================================

window.AIMatcher = {

    // Главная функция
    async match(transcription, images) {

        if (!transcription) {
            throw new Error("Нет расшифровки озвучки.");
        }

        if (!images || !images.length) {
            throw new Error("Нет изображений.");
        }

        const segments =
            transcription.segments || [];

        if (!segments.length) {
            throw new Error(
                "Не найдены фрагменты озвучки."
            );
        }

        const result = [];

        const usedImages = new Set();

        for (let i = 0; i < segments.length; i++) {

            const segment = segments[i];

            const image =
                this.findBestImage(
                    segment,
                    images,
                    usedImages
                );

            if (image) {
                usedImages.add(image);
            }

            result.push({

                index: i,

                start:
                    Number(segment.start || 0),

                end:
                    Number(segment.end || 0),

                duration:
                    Math.max(
                        0.1,
                        Number(segment.end || 0) -
                        Number(segment.start || 0)
                    ),

                text:
                    segment.text || "",

                keywords:
                    segment.keywords || [],

                image:
                    image

            });
        }

        return result;
    },


    // ========================================
    // ПОИСК ЛУЧШЕЙ КАРТИНКИ
    // ========================================

    findBestImage(
        segment,
        images,
        usedImages
    ) {

        const keywords =
            segment.keywords || [];

        let bestImage = null;
        let bestScore = -1;


        for (const image of images) {

            if (usedImages.has(image)) {
                continue;
            }

            const score =
                this.scoreImage(
                    image,
                    keywords
                );

            if (score > bestScore) {

                bestScore = score;

                bestImage = image;
            }
        }


        // Если все изображения уже
        // использовались — разрешаем повтор
        if (!bestImage && images.length) {

            bestImage =
                images[
                    segment.index %
                    images.length
                ];
        }


        return bestImage;
    },


    // ========================================
    // ОЦЕНКА КАРТИНКИ
    // ========================================

    scoreImage(image, keywords) {

        if (!image || !keywords.length) {
            return 0;
        }

        const name =
            this.normalize(
                image.name || ""
            );

        let score = 0;


        for (const keyword of keywords) {

            const word =
                this.normalize(keyword);

            if (!word) {
                continue;
            }


            // Точное совпадение
            if (name.includes(word)) {

                score += 20;
            }


            // Частичное совпадение
            const parts =
                name.split(" ");

            for (const part of parts) {

                if (
                    part.includes(word) ||
                    word.includes(part)
                ) {

                    score += 5;
                }
            }
        }


        return score;
    },


    // ========================================
    // НОРМАЛИЗАЦИЯ
    // ========================================

    normalize(text) {

        return String(text)
            .toLowerCase()
            .replace(
                /\.[^/.]+$/,
                ""
            )
            .replace(
                /[_\-.,!?;:()[\]{}]/g,
                " "
            )
            .replace(
                /\s+/g,
                " "
            )
            .trim();
    },


    // ========================================
    // СОЗДАНИЕ ГОТОВОГО TIMELINE
    // ========================================

    createTimeline(
        transcription,
        images,
        audioDuration
    ) {

        const segments =
            transcription.segments || [];


        if (!segments.length) {

            throw new Error(
                "Нет сегментов для таймлайна."
            );
        }


        const timeline = [];


        for (let i = 0; i < segments.length; i++) {

            const segment =
                segments[i];


            let start =
                Number(segment.start || 0);

            let end =
                Number(segment.end || 0);


            // Исправляем некорректные таймкоды
            if (end <= start) {

                const part =
                    audioDuration /
                    segments.length;

                start =
                    i * part;

                end =
                    (i + 1) * part;
            }


            timeline.push({

                index: i,

                start: start,

                end:
                    Math.min(
                        end,
                        audioDuration
                    ),

                duration:
                    Math.min(
                        end,
                        audioDuration
                    ) - start,

                text:
                    segment.text || "",

                keywords:
                    segment.keywords || [],

                image: null
            });
        }


        return timeline;
    },


    // ========================================
    // ПРИВЯЗКА ИЗОБРАЖЕНИЙ
    // ========================================

    attachImages(
        timeline,
        images
    ) {

        const used =
            new Set();


        return timeline.map(
            (item) => {

                const image =
                    this.findBestImage(
                        {
                            index: item.index,
                            keywords:
                                item.keywords
                        },
                        images,
                        used
                    );


                if (image) {
                    used.add(image);
                }


                return {

                    ...item,

                    image: image
                };
            }
        );
    }

};


// ============================================
// ГОТОВЫЙ РЕЗУЛЬТАТ
// ============================================

window.AIMatcherReady = true;
