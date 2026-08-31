// ============================================
// LONG VIDEO MAKER V4
// WHISPER TRANSCRIPTION
// ============================================

window.WhisperEngine = {

    loaded: false,
    transcriber: null,

    async load() {

        if (this.loaded) {
            return;
        }

        showWhisperStatus(
            "⏳ Загружаем AI-модель распознавания..."
        );

        // Загружаем Transformers.js
        if (!window.transformers) {

            await loadScript(
                "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2"
            );

        }

        const pipeline =
            window.transformers.pipeline;

        if (!pipeline) {

            throw new Error(
                "Не удалось загрузить AI-модель."
            );

        }

        /*
         * Whisper выполняется прямо в браузере.
         * Никакого собственного сервера для
         * базового распознавания не требуется.
         */

        this.transcriber =
            await pipeline(
                "automatic-speech-recognition",
                "Xenova/whisper-small",
                {
                    device: "wasm"
                }
            );

        this.loaded = true;

        showWhisperStatus(
            "✅ AI-модель готова"
        );
    },


    async transcribe(audioFile) {

        if (!audioFile) {

            throw new Error(
                "Аудиофайл не выбран."
            );

        }

        await this.load();

        showWhisperStatus(
            "🎙️ Распознаём озвучку..."
        );


        const audioData =
            await convertAudioToFloat32(
                audioFile
            );


        const result =
            await this.transcriber(
                audioData,
                {
                    chunk_length_s: 30,
                    stride_length_s: 5,
                    return_timestamps: true
                }
            );


        const text =
            result.text || "";


        const segments =
            normalizeSegments(
                result.chunks || []
            );


        showWhisperStatus(
            "✅ Озвучка распознана"
        );


        return {

            text: text,

            segments: segments

        };

    }

};


// ============================================
// LOAD SCRIPT
// ============================================

function loadScript(src) {

    return new Promise(
        (resolve, reject) => {

            const script =
                document.createElement("script");

            script.src = src;

            script.onload =
                resolve;

            script.onerror =
                () => reject(
                    new Error(
                        "Не удалось загрузить Transformers.js."
                    )
                );

            document.head.appendChild(
                script
            );

        }
    );

}


// ============================================
// AUDIO → FLOAT32
// ============================================

async function convertAudioToFloat32(
    file
) {

    const arrayBuffer =
        await file.arrayBuffer();


    const audioContext =
        new AudioContext({
            sampleRate: 16000
        });


    const audioBuffer =
        await audioContext.decodeAudioData(
            arrayBuffer
        );


    const channel =
        audioBuffer.getChannelData(0);


    const samples =
        new Float32Array(
            channel.length
        );


    samples.set(channel);


    await audioContext.close();


    return samples;

}


// ============================================
// TIMESTAMPS
// ============================================

function normalizeSegments(chunks) {

    return chunks.map(
        (chunk, index) => {

            let start = 0;
            let end = 0;


            if (
                Array.isArray(
                    chunk.timestamp
                )
            ) {

                start =
                    Number(
                        chunk.timestamp[0] || 0
                    );

                end =
                    Number(
                        chunk.timestamp[1] || start
                    );

            }


            return {

                index: index,

                text:
                    (chunk.text || "").trim(),

                start: start,

                end: end,

                keywords:
                    extractKeywordsFromText(
                        chunk.text || ""
                    )

            };

        }
    );

}


// ============================================
// KEYWORDS
// ============================================

function extractKeywordsFromText(text) {

    const stopWords = [

        "это",
        "как",
        "что",
        "когда",
        "где",
        "здесь",
        "этот",
        "эта",
        "эти",
        "того",
        "также",
        "был",
        "была",
        "были",
        "есть",
        "будет",
        "может",
        "можно",
        "очень",
        "для",
        "или",
        "при",
        "после",
        "перед",
        "между",
        "через",
        "его",
        "ее",
        "они",
        "мы",
        "вы",
        "все",
        "так",
        "уже"

    ];


    return text
        .toLowerCase()
        .replace(
            /[.,!?;:"()«»—–-]/g,
            " "
        )
        .split(/\s+/)
        .filter(word =>
            word.length >= 4 &&
            !stopWords.includes(word)
        );

}


// ============================================
// STATUS
// ============================================

function showWhisperStatus(text) {

    const status =
        document.getElementById(
            "status"
        );

    if (status) {

        status.style.display =
            "block";

        status.textContent =
            text;

    }

}
