(function () {
    const previewImage = document.getElementById('previewImage');
    const generateBackgroundBtn = document.getElementById('generateBackgroundBtn');
    const overlayTextInput = document.getElementById('overlayText');
    const fontSizeInput = document.getElementById('fontSize');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const colorInput = document.getElementById('color');
    const applyOverlayBtn = document.getElementById('applyOverlayBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    let currentBaseImageUrl = '/fallback.png';
    let lastOutputUrl = null;

    function safeFetch(url, options) {
        return fetch(url, options).then(function (res) {
            if (!res.ok) {
                throw new Error('Request failed with status ' + res.status);
            }
            return res;
        });
    }

    function setPreview(src) {
        currentBaseImageUrl = src;
        previewImage.src = src;
    }

    if (fontSizeInput && fontSizeValue) {
        fontSizeValue.textContent = fontSizeInput.value;
        fontSizeInput.addEventListener('input', function () {
            fontSizeValue.textContent = fontSizeInput.value;
        });
    }

    if (generateBackgroundBtn) {
        generateBackgroundBtn.addEventListener('click', function () {
            safeFetch('/generate')
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    if (data && data.imageUrl) {
                        setPreview(data.imageUrl);
                    } else {
                        setPreview('/fallback.png');
                    }
                })
                .catch(function () {
                    setPreview('/fallback.png');
                });
        });
    }

    if (applyOverlayBtn) {
        applyOverlayBtn.addEventListener('click', function () {
            var payload = {
                imageUrl: currentBaseImageUrl,
                text: (overlayTextInput && overlayTextInput.value) || '',
                fontSize: fontSizeInput ? parseInt(fontSizeInput.value, 10) || 64 : 64,
                color: (colorInput && colorInput.value) || '#ffffff'
            };

            safeFetch('/overlay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    if (data && data.imageUrl) {
                        lastOutputUrl = data.imageUrl;
                        previewImage.src = data.imageUrl;
                        if (downloadBtn) {
                            downloadBtn.disabled = false;
                        }
                    }
                })
                .catch(function () {
                    // Fallback: keep previous image, do not enable download
                });
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', function () {
            if (!lastOutputUrl) {
                return;
            }
            var link = document.createElement('a');
            link.href = lastOutputUrl;
            link.download = 'overlay-' + Date.now() + '.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // Initial state uses fallback image
    setPreview('/fallback.png');
})();