// ============================================
// LONG VIDEO MAKER V4
// AUDIO → TEXT
// ============================================

let speechRecognition = null;
let speechText = "";
let isRecognizing = false;


// ============================================
// ПРОВЕРКА ПОДДЕРЖКИ
// ============================================

function isSpeechRecognitionSupported() {

    return !!(
        window.SpeechRecognition ||
        window.webkitSpeechRecognition
    );

}


// ============================================
// СОЗДАНИЕ RECOGNITION
// ============================================

function createRecognition(language = "ru-RU") {

    const Recognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!Recognition) {

        throw new Error(
            "Распознавание речи не поддерживается этим браузером."
        );

    }


    const recognition =
        new Recognition();


    recognition.lang = language;

    recognition.continuous = true;

    recognition.interimResults = true;


    recognition.onstart = function () {

        isRecognizing = true;

        updateSpeechStatus(
            "🎙️ Слушаем озвучку..."
        );

    };


    recognition.onresult =
        function (event) {

            let finalText = "";
            let temporaryText = "";


            for (
                let i = event.resultIndex;
                i < event.results.length;
                i++
            ) {

                const result =
                    event.results[i];


                if (result.isFinal) {

                    finalText +=
                        result[0].transcript + " ";

                } else {

                    temporaryText +=
                        result[0].transcript;

                }

            }


            speechText += finalText;


            updateSpeechText(
                speechText + temporaryText
            );

        };


    recognition.onerror =
        function (event) {

            console.error(
                "Speech error:",
                event.error
            );

            updateSpeechStatus(
                "❌ Ошибка распознавания: " +
                event.error
            );

        };


    recognition.onend =
        function () {

            isRecognizing = false;

            updateSpeechStatus(
                "✅ Распознавание завершено"
            );

        };


    return recognition;

}


// ============================================
// ЗАПУСК
// ============================================

function startSpeechRecognition(
    language = "ru-RU"
) {

    speechText = "";

    speechRecognition =
        createRecognition(language);


    speechRecognition.start();

}


// ============================================
// ОСТАНОВКА
// ============================================

function stopSpeechRecognition() {

    if (
        speechRecognition &&
        isRecognizing
    ) {

        speechRecognition.stop();

    }

}


// ============================================
// ПОЛУЧЕНИЕ ТЕКСТА
// ============================================

function getSpeechText() {

    return speechText.trim();

}


// ============================================
// УСТАНОВКА ТЕКСТА
// ============================================

function setSpeechText(text) {

    speechText = text || "";

    updateSpeechText(
        speechText
    );

}


// ============================================
// UI
// ============================================

function updateSpeechStatus(text) {

    const element =
        document.getElementById(
            "speechStatus"
        );


    if (element) {

        element.textContent = text;

    }

}


function updateSpeechText(text) {

    const element =
        document.getElementById(
            "speechText"
        );


    if (element) {

        element.value = text;

    }

}


// ============================================
// ЭКСПОРТ
// ============================================

window.SpeechEngine = {

    supported:
        isSpeechRecognitionSupported,

    start:
        startSpeechRecognition,

    stop:
        stopSpeechRecognition,

    getText:
        getSpeechText,

    setText:
        setSpeechText

};
