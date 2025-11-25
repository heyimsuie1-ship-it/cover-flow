const express = require('express');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PUBLIC_DIR = path.join(__dirname, 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const OUTPUTS_DIR = path.join(PUBLIC_DIR, 'outputs');
const LEGACY_IMAGES_DIR = path.join(__dirname, 'images');

// Ensure required folders exist and seed a sample image + fallback
function ensureDirectoriesAndSample() {
    [PUBLIC_DIR, IMAGES_DIR, OUTPUTS_DIR].forEach((dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });

    const sampleSource = path.join(LEGACY_IMAGES_DIR, 'mountain-landscape.jpg');
    if (fs.existsSync(sampleSource)) {
        const seededSample = path.join(IMAGES_DIR, 'sample-mountain.jpg');
        const fallback = path.join(PUBLIC_DIR, 'fallback.png');

        try {
            if (!fs.existsSync(seededSample)) {
                fs.copyFileSync(sampleSource, seededSample);
            }
        } catch (err) {
            // Ignore seeding errors; app will still run with empty image list
        }

        try {
            if (!fs.existsSync(fallback)) {
                // Convert to PNG for predictable output format
                sharp(sampleSource)
                    .png()
                    .toFile(fallback)
                    .catch(() => {
                        // As a last resort, copy as-is (may not be PNG but keeps app working)
                        if (!fs.existsSync(fallback)) {
                            fs.copyFileSync(sampleSource, fallback);
                        }
                    });
            }
        } catch (err) {
            // Ignore fallback creation errors
        }
    }
}

ensureDirectoriesAndSample();

app.use(express.json());

// Serve static assets from /public
app.use(express.static(PUBLIC_DIR));

// GET /generate -> { imageUrl: "/images/<random-image>" }
app.get('/generate', (req, res) => {
    fs.readdir(IMAGES_DIR, (err, files) => {
        if (err) {
            return res.json({ imageUrl: '/fallback.png' });
        }

        const candidates = (files || []).filter((file) => {
            const ext = path.extname(file).toLowerCase();
            return ['.png', '.jpg', '.jpeg', '.webp'].includes(ext);
        });

        if (!candidates.length) {
            return res.json({ imageUrl: '/fallback.png' });
        }

        const randomIndex = Math.floor(Math.random() * candidates.length);
        const chosen = candidates[randomIndex];
        res.json({ imageUrl: '/images/' + chosen });
    });
});

// POST /overlay
// Body: { "imageUrl": "...", "text": "...", "fontSize": 64, "color": "#fff" }
// Returns: { "imageUrl": "/outputs/<filename>.png" }
app.post('/overlay', async (req, res) => {
    const body = req.body || {};
    const imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl : '';
    const text = typeof body.text === 'string' ? body.text : '';
    const fontSize = Number.isFinite(body.fontSize) ? body.fontSize : 64;
    const color = typeof body.color === 'string' ? body.color : '#ffffff';

    if (!imageUrl) {
        return res.status(400).json({ error: 'imageUrl is required' });
    }

    // Normalise image path and ensure it stays within /public
    const relativePath = imageUrl.replace(/^\/+/, '');
    const inputPath = path.join(PUBLIC_DIR, relativePath);

    if (!inputPath.startsWith(PUBLIC_DIR)) {
        return res.status(400).json({ error: 'Invalid image path' });
    }

    const outputFilename = uuidv4() + '.png';
    const outputPath = path.join(OUTPUTS_DIR, outputFilename);
    const outputUrl = '/outputs/' + outputFilename;

    async function renderWithOverlay() {
        const svg = createTextOverlaySVG(text, fontSize, color);
        const svgBuffer = Buffer.from(svg);

        // Composite the SVG on top of the source image and output PNG
        await sharp(inputPath)
            .composite([{ input: svgBuffer, gravity: 'south' }])
            .png()
            .toFile(outputPath);

        return outputUrl;
    }

    async function copyWithoutOverlay() {
        // Fallback: copy/convert the original image into outputs
        try {
            await sharp(inputPath).png().toFile(outputPath);
        } catch (e) {
            fs.copyFileSync(inputPath, outputPath);
        }
        return outputUrl;
    }

    try {
        const finalUrl = text ? await renderWithOverlay() : await copyWithoutOverlay();
        res.json({ imageUrl: finalUrl });
    } catch (err) {
        try {
            const finalUrl = await copyWithoutOverlay();
            res.json({ imageUrl: finalUrl });
        } catch (innerErr) {
            res.status(500).json({ error: 'Failed to render or copy image' });
        }
    }
});

function createTextOverlaySVG(text, fontSize, color) {
    const safeText = (text || '').toString().replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const size = 1080; // virtual canvas
    const padding = 60;
    const textAreaWidth = size - padding * 2;

    // Simple multi-line handling: split on \n, SVG will wrap horizontally if needed
    const lines = safeText.split('\n').filter(Boolean);
    const lineHeight = Math.round(fontSize * 1.25);

    const svgLines = lines
        .map((line, index) => {
            const y = size - padding - (lines.length - 1 - index) * lineHeight;
            return `<tspan x="${size / 2}" y="${y}">${line}</tspan>`;
        })
        .join('');

    return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="textBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(0,0,0,0.55)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.85)"/>
    </linearGradient>
  </defs>
  <rect x="0" y="${size - (lines.length * lineHeight + padding * 2)}" width="${size}" height="${lines.length * lineHeight + padding * 2}" fill="url(#textBg)"/>
  <text
    x="${size / 2}"
    text-anchor="middle"
    fill="${color}"
    font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    font-size="${fontSize}"
    font-weight="600">
    ${svgLines}
  </text>
</svg>
`.trim();
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log('Server listening on http://localhost:' + PORT);
});