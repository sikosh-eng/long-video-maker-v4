// ============================================
// LONG VIDEO MAKER V4
// AI ANALYSIS
// ============================================

const AI_CONFIG = {
    enabled: false,

    // Позже сюда можно подключить AI API
    apiUrl: "",
    apiKey: ""
};


// ============================================
// АНАЛИЗ СЦЕНАРИЯ
// ============================================

async function analyzeScript(text) {

    if (!text || !text.trim()) {
        throw new Error("Текст для анализа отсутствует.");
    }

    /*
      Здесь будет AI-анализ.

      На вход:
      "В Нью-Йорке построили огромный небоскрёб..."

      На выход:
      [
        {
          start: 0,
          end: 4,
          keywords: ["Нью-Йорк", "небоскрёб"]
        }
      ]
    */

    if (!AI_CONFIG.enabled) {

        return createBasicSegments(text);

    }


    const response = await fetch(
        AI_CONFIG.apiUrl,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization":
                    "Bearer " + AI_CONFIG.apiKey
            },

            body: JSON.stringify({
                text: text
            })
        }
    );


    if (!response.ok) {

        throw new Error(
            "AI API вернул ошибку: " +
            response.status
        );

    }


    return await response.json();

}


// ============================================
// БАЗОВОЕ РАЗБИЕНИЕ ТЕКСТА
// ============================================

function createBasicSegments(text) {

    const sentences =
        text
            .replace(/\s+/g, " ")
            .split(/(?<=[.!?])\s+/)
            .filter(Boolean);


    return sentences.map(
        (sentence, index) => {

            return {

                index: index,

                text: sentence,

                keywords:
                    extractKeywords(sentence)

            };

        }
    );

}


// ============================================
// ИЗВЛЕКАЕМ КЛЮЧЕВЫЕ СЛОВА
// ============================================

function extractKeywords(text) {

    const stopWords = [

        "и",
        "в",
        "на",
        "с",
        "по",
        "из",
        "для",
        "это",
        "как",
        "что",
        "а",
        "но",
        "или",
        "же",
        "у",
        "к",
        "о",
        "об",
        "за",
        "от",
        "до",
        "не",
        "так",
        "его",
        "ее",
        "они",
        "мы",
        "вы"

    ];


    return text
        .toLowerCase()
        .replace(/[.,!?;:"()]/g, "")
        .split(/\s+/)
        .filter(word =>
            word.length > 3 &&
            !stopWords.includes(word)
        );

}


// ============================================
// СРАВНЕНИЕ КАРТИНКИ И ТЕКСТА
// ============================================

function calculateImageScore(
    imageName,
    keywords
) {

    const imageText =
        imageName
            .toLowerCase()
            .replace(/\.[^/.]+$/, "")
            .replace(/[_-]/g, " ");


    let score = 0;


    keywords.forEach(keyword => {

        if (imageText.includes(keyword)) {

            score += 10;

        }

    });


    return score;

}


// ============================================
// ВЫБОР ЛУЧШЕЙ КАРТИНКИ
// ============================================

function findBestImage(
    images,
    keywords,
    usedImages = []
) {

    let bestImage = null;

    let bestScore = -1;


    images.forEach(image => {

        if (usedImages.includes(image)) {
            return;
        }


        const score =
            calculateImageScore(
                image.name,
                keywords
            );


        if (score > bestScore) {

            bestScore = score;

            bestImage = image;

        }

    });


    // Если совпадений нет —
    // берём первую свободную картинку

    if (!bestImage) {

        bestImage =
            images.find(
                image =>
                    !usedImages.includes(image)
            );

    }


    return bestImage;

}


// ============================================
// AI TIMELINE
// ============================================

async function createAITimeline(
    script,
    images,
    audioDuration
) {

    const segments =
        await analyzeScript(script);


    if (!segments.length) {

        throw new Error(
            "Не удалось найти части сценария."
        );

    }


    const segmentDuration =
        audioDuration / segments.length;


    const usedImages = [];

    const timeline = [];


    segments.forEach(
        (segment, index) => {

            const image =
                findBestImage(
                    images,
                    segment.keywords,
                    usedImages
                );


            if (image) {

                usedImages.push(image);

            }


            timeline.push({

                index: index,

                text: segment.text,

                keywords:
                    segment.keywords,

                image: image,

                start:
                    index * segmentDuration,

                end:
                    (index + 1) *
                    segmentDuration,

                duration:
                    segmentDuration

            });

        }
    );


    return timeline;

}


// ============================================
// ЭКСПОРТ ФУНКЦИЙ
// ============================================

window.AI = {

    analyzeScript,

    createAITimeline,

    findBestImage,

    extractKeywords

};
