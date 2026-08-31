window.TimelineUI = {

    render: function(timeline) {

        const container =
            document.getElementById("timelinePreview");

        if (!container) {
            return;
        }

        container.innerHTML = "";

        timeline.forEach(function(item, index) {

            const card =
                document.createElement("div");

            card.style.background = "#11141c";
            card.style.border = "1px solid #292d38";
            card.style.borderRadius = "12px";
            card.style.padding = "12px";
            card.style.marginBottom = "10px";

            const title =
                document.createElement("div");

            title.style.fontWeight = "bold";

            title.textContent =
                "Кадр " + (index + 1);

            const time =
                document.createElement("div");

            time.style.color = "#a78bfa";
            time.style.marginTop = "5px";

            time.textContent =
                formatTime(item.start) +
                " → " +
                formatTime(item.end);

            const image =
                document.createElement("div");

            image.style.marginTop = "8px";

            image.textContent =
                "🖼️ " +
                (
                    item.image
                    ? item.image.name
                    : "Нет изображения"
                );

            const speech =
                document.createElement("div");

            speech.style.marginTop = "8px";
            speech.style.color = "#9ca3af";

            speech.textContent =
                item.text
                ? "🗣️ " + item.text
                : "🗣️ Текст пока отсутствует";

            card.appendChild(title);
            card.appendChild(time);
            card.appendChild(image);
            card.appendChild(speech);

            container.appendChild(card);
        });
    }

};


function formatTime(seconds) {

    seconds = Number(seconds) || 0;

    const minutes =
        Math.floor(seconds / 60);

    const secs =
        seconds % 60;

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        secs.toFixed(1).padStart(4, "0")
    );
}
