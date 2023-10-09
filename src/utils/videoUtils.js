const URL = window.URL || window.webkitURL;

export function fetch_json(url) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            dataType: "json",
            success: function (data) {
                resolve(data);
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}

export function load_video_from_url(videoElement, url) {
    videoElement.src = url;
}

export function load_video_dragged(event, videoElement) {
    const file = event.target.files[0];
    const file_url = URL.createObjectURL(file);
    load_video_from_url(videoElement, file_url);
}

export function load_json_dragged(event) {
    const file = event.target.files[0];
    const file_url = URL.createObjectURL(file);
    return fetch_json(file_url);
}

export function drag_enter(ev) {
    ev.preventDefault();
}

export function drop_video(ev, videoInputElement) {
    ev.preventDefault();
    videoInputElement.files = ev.dataTransfer.files;
    videoInputElement.dispatchEvent(new Event('change'));
}

export function drop_json(ev, jsonInputElement) {
    ev.preventDefault();
    jsonInputElement.files = ev.dataTransfer.files;
    jsonInputElement.dispatchEvent(new Event('change'));
}
