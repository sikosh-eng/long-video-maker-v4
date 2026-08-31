// ============================================
// LONG VIDEO MAKER V4
// AUDIO TRANSCRIBER
// ============================================

window.AudioTranscriber = {

    async getAudioInfo(file) {

        if (!file) {
            throw new Error("Аудиофайл не выбран.");
        }

        const url = URL.createObjectURL(file);

        try {

            const audio = new Audio();

            audio.src = url;

            await new Promise((resolve, reject) => {

                audio.onloadedmetadata = resolve;

                audio.onerror = () => {
                    reject(
                        new Error(
                            "Не удалось открыть аудиофайл."
                        )
                    );
                };

            });

            return {
                duration: audio.duration,
                name: file.name,
                type: file.type,
                size: file.size
            };

        } finally {

            URL.revokeObjectURL(url);

        }
    },


    async prepareForTranscription(file) {

        const info =
            await this.getAudioInfo(file);

        return {
            file: file,
            duration: info.duration,
            name: info.name,
            type: info.type,
            size: info.size
        };
    },


    async transcribe(file) {

        /*
         * ВАЖНО:
         *
         * Здесь будет подключён настоящий
         * speech-to-text сервис.
         *
         * Схема:
         *
         * MP3/WAV
         *     ↓
         * Speech-to-Text
         *     ↓
         * текст + таймкоды
         *
         * Пока возвращаем понятное состояние,
         * чтобы приложение не делало вид,
         * что уже распознало речь.
         */

        const info =
            await this.prepareForTranscription(
                file
            );

        return {

            success: false,

            duration:
                info.duration,

            text: "",

            segments: [],

            message:
                "Для распознавания речи нужно подключить Speech-to-Text API."

        };
    }

};
